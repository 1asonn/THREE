import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FocusShader } from 'three/examples/jsm/shaders/FocusShader'

import Tween from '@tweenjs/tween.js'
import type { Group as TweenGroup } from '@tweenjs/tween.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { throttle } from 'lodash'

import g from '@/assets/images/gradient.png'
import { ParticleModelProps, TWEEN_POINT } from '@/declare/THREE'
import VerticesDuplicateRemove from '@/utils/VerticesDuplicateRemove'
import BuiltinShaderAttributeName from '@/constant/THREE/BuiltinShaderAttributeName'
import { instanceBasic } from '@/declare/THREE/instance'


function getRangeRandom(e: number, t: number) {
    return Math.random() * (t - e) + e
  }

// 定义粒子类型
type THREE_POINT = THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
interface instanceItem extends instanceBasic {}

interface ParticleSystemProps {
    CanvasWrapper:HTMLDivElement,
    Models:ParticleModelProps[],
    instance:instanceItem[]
    AnimateDuration?:number,
    // onModelsFinishedLoad?:(...args:any)=>void,
    // LoadingManager?:THREE.LoadingManager
}

class ParticleSystem {
    private readonly CanvasWrapper: HTMLDivElement
    private readonly modelList: Map<string, THREE.BufferGeometry>
    private _LOAD_COUNT_: number
    private readonly ModelPointer: number
    private maxParticlesCount: number
    private WIDTH: number
    private HEIGHT: number
    private readonly orbitControls?: OrbitControls
    private stats?: Stats
    /** 主要表演场景对象 */
    public scene?: THREE.Scene
    /** 主要相机对象 */
    public camera?: THREE.PerspectiveCamera
    /** 渲染器 */
    public renderer?: THREE.WebGLRenderer
    /** 效果器 */
    public composer?: EffectComposer
    /** 加载进度管理器 */
    public manager?: THREE.LoadingManager
    /** 粒子默认材质 */
    public PointMaterial?: THREE.PointsMaterial
    /** 表演粒子，即用于呈现模型的粒子载体对象 */
    public AnimateEffectParticle?: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
  
    private readonly AnimateDuration: number
    private mouseV: number
    private mouseK: number
    private hadListenMouseMove?: boolean
    private MainParticleGroup?: TweenGroup
    private readonly defaultLoader: OBJLoader
    /** 表演粒子 tween 实例数组 */
    public readonly ParticleAnimeMap: TWEEN_POINT[]
    /** 模型数组 */
    public Models: Map<string, ParticleModelProps>
    /** 额外插件的数组 eg:氛围粒子模型...*/ 
    public instance?: any[]
    // 函数相关
    /** 当所有模型加载完成时进行调用 */
    private readonly onModelsFinishedLoad?: (preformPoint: THREE_POINT, scene: THREE.Scene) => void
  
    /** 对象内置的更新函数，内部使用 `requestAnimationFrame`，每渲染新的一帧时进行调用 */
    public onRendering?: (t: number) => void
    public CurrentUseModelName?: string
    public LastUseModelName?: string
  
    // 新编写的物体添加核心
    constructor(options: ParticleSystemProps) {
      const { AnimateDuration } = options
      this.CanvasWrapper = options.CanvasWrapper
      this.instance = options.instance != null ? options.instance : []
      this.Models = new Map<string, ParticleModelProps>()
      for (const i of options.Models) {
        this.Models.set(i.name, i)
      }
      this.AnimateDuration = typeof AnimateDuration === 'number' ? AnimateDuration : 1500
      this.defaultLoader = new OBJLoader()
      /** 粒子Map */
      this.ParticleAnimeMap = []
      /* 宽高 */
      this.HEIGHT = window.innerHeight
      this.WIDTH = window.innerWidth
      /** 模型列表  */
      this.modelList = new Map()
      /** 已加载的模型数量统计 */
      this._LOAD_COUNT_ = 0
      /** 模型指针 */
      this.ModelPointer = 0
      /** 载入模型中粒子的最大数量 */
      this.maxParticlesCount = 0
      // 创建场景
      this.createScene()
      // 性能监控插件
      this.initStats()
      // 载入模型
    //   this._addModels()
      // 效果器
      this.createEffect()
      // 轨道控制插件（鼠标拖拽视角、缩放等）
      this.orbitControls = new OrbitControls(this.camera!, this.renderer!.domElement)
      this.mouseK = 0
      this.mouseV = 0
      // 循环更新渲染场景
      this.update(0)
    }

    private createScene(){
        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.FogExp2(328972, 5e-4)
        // 创建相机
        const fieldOfView = 100
        const aspectRatio = this.WIDTH / this.HEIGHT
        const nearPlane = 1
        const farPlane = 5e4
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
        this.camera.position.set(0, 0, 1e3)
        this.camera.lookAt(new THREE.Vector3(0,0,0))

        // 坐标轴辅助器
        const axesHelper = new THREE.AxesHelper(500)
        this.scene.add(axesHelper)

        if(this.instance){
            this.instance.forEach((item) => {
                this.scene?.add(item.Geometry)
            })
        }

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
        // 在 css 中设置背景色透明显示渐变色
        alpha: true,
        // 开启抗锯齿
        // antialias: true,
        })
        // 自动清理，解决 bloomPass 效果器冲突
        this.renderer.autoClear = false
        // 渲染背景颜色同雾化的颜色
        this.renderer.setClearColor(this.scene.fog.color)
        // 定义渲染器的尺寸；在这里它会填满整个屏幕
        this.renderer.setSize(this.WIDTH, this.HEIGHT)
    
        // 打开渲染器的阴影地图
        this.renderer.shadowMap.enabled = true
        // this.renderer.shadowMapSoft = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        // 在 HTML 创建的容器中添加渲染器的 DOM 元素
        this.CanvasWrapper.appendChild(this.renderer.domElement)
        // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
        window.addEventListener('resize', this.handleWindowResize, false)
    }

    //窗口大小变动时调用
    private readonly handleWindowResize = () => {
        this.WIDTH = window.innerWidth
        this.HEIGHT = window.innerHeight
        this.renderer?.setSize(this.WIDTH, this.HEIGHT)
        if(this.camera){
            this.camera.aspect = this.WIDTH / this.HEIGHT
            this.camera.updateProjectionMatrix()
        }
    }

    // 性能监控
    private initStats(){
        this.stats = Stats()
        if(this.stats){
            // 放置在左上角
            this.stats.domElement.style.position = 'absolute'
            this.stats.domElement.style.left = '0px'
            this.stats.domElement.style.top = '0px'
            this.stats.domElement.style.zIndex = '100'
            this.CanvasWrapper.appendChild(this.stats.domElement)
        }
    }

    
    private createEffect(){
        this.composer = new EffectComposer(this.renderer!)
        const renderPass = new RenderPass(this.scene!,this.camera!)
        const bloomPass = new BloomPass(0.75)
        const filmPass = new FilmPass(0.5,0.5,1500,0)
        const shaderPass = new ShaderPass(FocusShader)
        shaderPass.uniforms.screenWidth.value = window.innerWidth
        shaderPass.uniforms.screenHeight.value = window.innerHeight
        shaderPass.uniforms.sampleDistance.value = 0.4
        shaderPass.renderToScreen = true
    
        this.composer.addPass(renderPass)
        this.composer.addPass(bloomPass)
        this.composer.addPass(filmPass)
        this.composer.addPass(shaderPass)
    }


    private update(t:number){
        Tween.update()
        this.MainParticleGroup?.update()
        this.onRendering?.call(this,t)
        this.stats?.update()
        this.instance?.forEach((item) => {
            item.update()
        })
        this.composer?.render()
        requestAnimationFrame((t) => {
            this.update(t)
        })
    }

    private _addModels(){
        const TextureLoader = new THREE.TextureLoader()
        this.PointMaterial = new THREE.PointsMaterial({
            size: 5,
            sizeAttenuation: true,
            transparent: true,
            depthWrite: false,
            opacity: 1,
            map: TextureLoader.load(g),
            blending: THREE.AdditiveBlending
        })
        this.Models.forEach((model) => {
            let Geometry:THREE.BufferGeometry
            let Vertices = new Float32Array([])

            const finishLoad = () => {
                
            }
        })
    }
}

export default ParticleSystem
