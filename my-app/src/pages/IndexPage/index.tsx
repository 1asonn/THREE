import { AtmosphereParticle } from "@/THREE/atmosphere";
import Tween from '@tweenjs/tween.js'

const AtmosphereRange = 1500
function IndexPage(){
    
   
    const TurnBasicNum = { firefly: 0.02}
    const a1 = 1500

    const tween1 = new Tween.Tween(TurnBasicNum).easing()
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
        }
    })
}