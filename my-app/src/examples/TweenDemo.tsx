import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 修改导入方式
import * as TWEEN from '@tweenjs/tween.js';

const TweenDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 初始化Three.js场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // 创建Tween组，用于管理所有动画
    const tweenGroup = new TWEEN.Group();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    // 添加光照
    const ambientLight = new THREE.AmbientLight(0x404040); // 柔和的环境光
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 方向光
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 创建一个立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00, // 绿色
      shininess: 100, // 高光度
      specular: 0x111111 // 高光颜色
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 设置相机位置
    camera.position.set(0, 0, 5);

    // 创建Tween动画 - 位置变化
    const positionTween = new TWEEN.Tween(cube.position, tweenGroup)
      .to({ x: 3 }, 3000) // 移动到x=3的位置
      .easing(TWEEN.Easing.Quadratic.InOut) // 使用二次缓动函数


    const positionTween2 = new TWEEN.Tween(cube.position, tweenGroup)
      .to({ x: 0 }, 3000)
      .easing(TWEEN.Easing.Quadratic.InOut)
    
      positionTween.chain(positionTween2)
      positionTween2.chain(positionTween)

    //动画会出现闪烁情况 
    // const positionTween3 = new TWEEN.Tween(cube.position, tweenGroup)
    // .to({ x: 3 }, 3000) // 移动到x=3的位置
    // .easing(TWEEN.Easing.Quadratic.InOut) // 使用二次缓动函数
    // .yoyo(true)
    // .repeat(Infinity)

    // 创建Tween动画 - 旋转变化
    const rotationTween = new TWEEN.Tween(cube.rotation, tweenGroup)
      .to({ x: Math.PI * 2, y: Math.PI * 2 }, 3000) // 5秒内旋转一圈
      .easing(TWEEN.Easing.Exponential.InOut) // 使用指数缓动函数
      .repeat(Infinity); // 无限重复

    // 创建Tween动画 - 颜色变化
    const colorObj = { r: 0, g: 1, b: 0 }; // 初始颜色 (绿色)
    const colorTween = new TWEEN.Tween(colorObj, tweenGroup)
      .to({ r: 1, g: 0, b: 1 }, 3000) // 3秒内变为紫色
      .easing(TWEEN.Easing.Cubic.InOut) // 使用三次方缓动函数
      .yoyo(false) // 来回变化
      .repeat(Infinity) // 无限重复
      .onUpdate(() => {
        // 更新材质颜色
        (material as THREE.MeshPhongMaterial).color.setRGB(colorObj.r, colorObj.g, colorObj.b);
      });

    // 启动所有Tween动画
    positionTween.start();
    // rotationTween.start();
    // colorTween.start();
    
    // 动画循环函数
    function animate(time?: number) {
      requestAnimationFrame(animate);
      console.log("this is time",time)
      // 更新Tween动画 - 这是关键点
      // 使用tweenGroup.update而不是全局的TWEEN.update
      tweenGroup.update(time);
      
      // 渲染Three.js场景
      renderer.render(scene, camera);
    }
    
    // 启动动画循环
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="tween-demo-container">
      <div ref={containerRef} style={{ width: '100%', height: '100vh' }}></div>
      <div className="info-panel" style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '300px'
      }}>
        <h2>Three.js + Tween.js 演示</h2>
        <p>此示例展示了如何使用Tween.js为Three.js对象创建动画：</p>
        <ul>
          <li>位置动画：立方体在x轴上来回移动</li>
          <li>旋转动画：立方体围绕x轴和y轴旋转</li>
          <li>颜色动画：立方体颜色在绿色和紫色之间变化</li>
        </ul>
        <p><strong>关键点：</strong>在Three.js的动画循环中调用<code>tweenGroup.update(time)</code>来更新所有Tween动画，这是最新推荐的方法，替代了已弃用的TWEEN.update</p>
      </div>
    </div>
  );
};

export default TweenDemo;
