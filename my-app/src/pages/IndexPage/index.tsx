import { AtmosphereParticle } from "@/THREE/atmosphere";
import { useEffect, useRef } from 'react'
import ParticleSystem from '@/THREE'
import Tween from '@tweenjs/tween.js'

const AtmosphereRange = 1500
function IndexPage(){
    
    let MainParticle: ParticleSystem | null = null
    const TurnBasicNum = { firefly: 0.02}
    const a1 = 1500

    const tween2 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)
    const tween1 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)

    const Atomsphere1 = new AtmosphereParticle({
        longestDistance: AtmosphereRange,
        particleSum: 500,
        renderUpdate: (Point) => {
            Point.rotation.x -= TurnBasicNum.firefly
        },
        onInitialize: (Point) => {
            Point.position.x = -1 * a1 
        },
        onChangeModel: (Point) => {
            tween2.stop()
            tween1.stop().to({ firefly: 0.04 }, 1500).chain(tween2)
            tween2.to({ firefly: 0.002 }, 1500)
            tween1.start()
        }
    })

      // @ts-expect-error
    window.changeModel = (name: string) => {
        if (MainParticle != null) {
        MainParticle.ChangeModel(name)
        }
    }

    useEffect(() => {
        if ((MainParticle == null) && wrapper.current != null) {
        MainParticle = new ParticleSystem({
            CanvasWrapper: wrapper.current,
            Models,
            addons: [Atomsphere1, Atomsphere2, Atomsphere3],
            onModelsFinishedLoad: (point) => {
            MainParticle?.ListenMouseMove()
            }
        })
        }
    })
}