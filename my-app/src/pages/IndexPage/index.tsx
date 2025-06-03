import AtmosphereParticle from "../../THREE/atmosphere";
import { useEffect, useRef } from 'react'
import Styles from './index.module.scss'
import ParticleSystem from '../../THREE'
import Tween from '@tweenjs/tween.js'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BufferGeometry, Float32BufferAttribute } from "three";
import VerticesDuplicateRemove from '../../utils/VerticesDuplicateRemove'

const AtmosphereRange = 1500
function IndexPage(){
    const wrapper = useRef<HTMLDivElement | null>(null)
    let MainParticle: ParticleSystem | null = null
    const TurnBasicNum = { firefly: 0.002}
    const a1 = 1500

    const tween2 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)
    const tween1 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)

    // 氛围粒子1 
    const Atomsphere1 = new AtmosphereParticle({
        longestDistance: AtmosphereRange,
        particleSum: 500,
        renderUpdate: (Point) => {
            Point.rotation.z -= TurnBasicNum.firefly
        },
        onInitialize: (Point) => {
            Point.position.x = -1 * a1
        },
        onChangeModel: () => {
            tween2.stop()
            tween1.stop().to({ firefly: 0.04 }, 1500).chain(tween2)
            tween2.to({ firefly: 0.002 }, 1500)
            tween1.start()
        }
    })

    // 氛围粒子2
    const Atomsphere2 = new AtmosphereParticle({
      longestDistance: AtmosphereRange,
      particleSum: 500,
      renderUpdate: (Point) => {
        Point.rotation.y += TurnBasicNum.firefly
      },
      onInitialize: (Point) => {
        Point.position.y = -0.2 * a1
        Point.position.z = -1 * a1
      }
    })

    // 氛围粒子3
    const Atomsphere3 = new AtmosphereParticle({
      longestDistance: AtmosphereRange,
      particleSum: 500,
      renderUpdate: (Point) => {
        Point.rotation.z += TurnBasicNum.firefly / 2
      },
      onInitialize: (Point) => {
        Point.position.z = -1.2 * a1
      }
    })

    const Models = [
    {
      name:'ball3',
      path:new URL('../../THREE/models/ball3.fbx',import.meta.url).href,
      onLoadComplete(Geometry:THREE.BufferGeometry) {
        const s = 400
        Geometry.scale(s, s, s)
        
        // 旋转球体，使顶点朝上下方向（X轴旋转90度）
        Geometry.translate(-600, 0, -100)
      },
      loader:{
        loaderInstance : new FBXLoader(),
        load(group:any){
          const g = new BufferGeometry()
          let arr = new Float32Array([])
          for (const i of group.children){
            arr = new Float32Array([...arr,...i.geometry.attributes.position.array])
          }
          g.setAttribute('position',new Float32BufferAttribute(VerticesDuplicateRemove(arr),3))
          return g
        }
      },
    },
    {
      name:'cube',
      path:new URL('../../THREE/models/cube.fbx',import.meta.url).href,
      onLoadComplete(Geometry:THREE.BufferGeometry) {
        const s = 400
        Geometry.scale(s, s, s)
      },
      loader:{
        loaderInstance : new FBXLoader(),
        load(group:any){
          const g = new BufferGeometry()
          let arr = new Float32Array([])
          for (const i of group.children){
            arr = new Float32Array([...arr,...i.geometry.attributes.position.array])
          }
          g.setAttribute('position',new Float32BufferAttribute(VerticesDuplicateRemove(arr),3))
          return g
        }
      }
    },
    {
      name:'apollo',
      path:new URL('../../THREE/models/ApolloSoyuz.glb', import.meta.url).href,
      loader:{
        loaderInstance : new GLTFLoader(),
        load(gltf:any){
          const g = new BufferGeometry()
          let arr = new Float32Array([])
          console.log("this is gltf",gltf)
          // for (const i of gltf.scene.children){
          //   arr = new Float32Array([...arr,...i.geometry.attributes.position.array])
          // }
          // g.setAttribute('position',new Float32BufferAttribute(VerticesDuplicateRemove(arr),3))
          return g
        }
      }
    }
  ]
      // @ts-expect-error
    window.changeModel = (name: string) => {
        if (MainParticle != null) {
        MainParticle.ChangeModel(name)
        }
    }
    
    useEffect(() => {
        if ((MainParticle == null) && wrapper.current != null) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          MainParticle = new ParticleSystem({
            Models,
            CanvasWrapper: wrapper.current,
            instance: [Atomsphere1,Atomsphere2,Atomsphere3]
        })
        }
    })

    return (
        <div className={Styles.index_page}>
          <div className={Styles.canvas_wrapper} ref={wrapper}></div>
          <ul className={Styles.list}>
            {
              Models.map((val) => {
                return (
                  <li key={val.name} onClick={() => {MainParticle?.ChangeModel(val.name)}}>{val.name}</li>
                )
              })
            }
          </ul>
          <ul className={Styles.function_list}>
            <li onClick={() => MainParticle?.ListenMouseMove()}>ListenMouseMove</li>
            <li onClick={() => MainParticle?.StopListenMouseMove()}>StopListenMouseMove</li>
            {/* <li onClick={() => MainParticle?.AlignCameraCenter()}>AlignCameraCenter</li>
            <li onClick={() => MainParticle?.AlignCameraCenter(true)}>AlignCameraCenter(immediately)</li> */}
          </ul>
        </div>
      )
}

export default IndexPage