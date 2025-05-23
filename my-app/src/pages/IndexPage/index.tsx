import AtmosphereParticle from "../../THREE/atmosphere";
import { useEffect, useRef } from 'react'
import Styles from './index.module.scss'
import ParticleSystem from '../../THREE'
import Tween from '@tweenjs/tween.js'

const AtmosphereRange = 1500
function IndexPage(){
    const wrapper = useRef<HTMLDivElement | null>(null)
    let MainParticle: ParticleSystem | null = null
    const TurnBasicNum = { firefly: 0.002}
    const a1 = 1500

    const tween2 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)
    const tween1 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)

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
            // tween2.stop()
            // tween1.stop().to({ firefly: 0.04 }, 1500).chain(tween2)
            // tween2.to({ firefly: 0.002 }, 1500)
            // tween1.start()
        }
    })

    const Models = [{
      name:'cube',
      path:new URL('../../THREE/models/cube.fbx',import.meta.url).href
      
    }]
    //   // @ts-expect-error
    // window.changeModel = (name: string) => {
    //     if (MainParticle != null) {
    //     MainParticle.ChangeModel(name)
    //     }
    // }

    useEffect(() => {
        if ((MainParticle == null) && wrapper.current != null) {
        MainParticle = new ParticleSystem({
            Models: [],
            CanvasWrapper: wrapper.current,
            instance: [Atomsphere1]
        })
        }
    })

    return (
        <div className={Styles.index_page}>
          <div className={Styles.canvas_wrapper} ref={wrapper}></div>
          <ul className={Styles.list}>
            {/* {
              Models.map((val) => {
                return (
                  <li key={val.name} onClick={() => MainParticle?.ChangeModel(val.name)}>{val.name}</li>
                )
              })
            } */}
          </ul>
          <ul className={Styles.function_list}>
            {/* <li onClick={() => MainParticle?.ListenMouseMove()}>ListenMouseMove</li>
            <li onClick={() => MainParticle?.StopListenMouseMove()}>StopListenMouseMove</li>
            <li onClick={() => MainParticle?.AlignCameraCenter()}>AlignCameraCenter</li>
            <li onClick={() => MainParticle?.AlignCameraCenter(true)}>AlignCameraCenter(immediately)</li> */}
          </ul>
        </div>
      )
}

export default IndexPage