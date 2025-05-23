import * as THREE from 'three'
import g from '../assets/images/gradient.png'
import {instanceBasic} from '../declare/THREE/instance'

// 随机函数
function getRandomRange(a:number,b:number){
    return Math.random() * (a -b) + b
}

// 定义氛围粒子材质
const textureLoader = new THREE.TextureLoader()
const pointMaterial = new THREE.PointsMaterial({
    size: 7,
    map: textureLoader.load(g),
    blending:THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
})


// 定义氛围粒子系统的入参
export interface AtmosphereParticleProps {
    // 粒子出现的范围
    longestDistance: number

    // 系统粒子的个数
    particleSum: number

    // 每一帧更新渲染时调用
    renderUpdate?: (Point: THREE.Points) => void 
    
    // 粒子系统初始时调用
    onInitialize?: (Point: THREE.Points) => void

    // 切换粒子系统时调用
    onChangeModel?: (Point: THREE.Points) => void
}

// 定义氛围粒子系统
class AtmosphereParticle extends instanceBasic{
    private readonly longestDistance: number
    private readonly particleSum: number
    private readonly renderUpdate?: (Point: THREE.Points) => void
    private readonly onChangeModel?: (Point: THREE.Points) => void
    private readonly onInitialize?: (Point: THREE.Points) => void
    public Geometry?: THREE.Points

    constructor(options: AtmosphereParticleProps){
        super()
        const{longestDistance, particleSum, renderUpdate, onChangeModel} = options
        this.longestDistance = longestDistance
        this.particleSum = particleSum
        this.renderUpdate = renderUpdate
        this.onChangeModel = onChangeModel

        //为粒子生成初始随机坐标 
        const vertices = []
        for(let i =0; i<particleSum; i++){
            const x = getRandomRange(-1 * longestDistance,longestDistance)
            const y = getRandomRange(-1 * longestDistance,longestDistance)
            const z = getRandomRange(-1 * longestDistance,longestDistance)
            vertices.push(x,y,z)
        }

        // 氛围粒子系统初始化
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        this.Geometry = new THREE.Points(geometry, pointMaterial)
        options.onInitialize?.call(this, this.Geometry)
    }

    update = () => {
        this.renderUpdate?.call(this, this.Geometry!)
    }

    ChangeModel = () => {
        this.onChangeModel?.call(this, this.Geometry!)
    }
}

export default AtmosphereParticle