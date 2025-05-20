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
// import { throttle } from 'lodash'

import g from '@/assets/images/gradient.png'
// import { ParticleModelProps, TWEEN_POINT } from '@/declare/THREE'
// import VerticesDuplicateRemove from '@/utils/VerticesDuplicateRemove.js'
import BuiltinShaderAttributeName from '@/constant/THREE/BuiltinShaderAttributeName'
import { instanceBasic } from '@/declare/THREE/instance'

// 定义粒子类型
type THREE_POINT = THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>

interface ParticleModelProps {
    CanvasWrapper:HTMLDivElement,
    Models:ParticleModelProps
}