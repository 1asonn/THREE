import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

const SimpleTweenDemo: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // 创建容器变量以在清理函数中使用
    const container = canvasRef.current;
    
    // 初始化Three.js场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // 设置渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    container.appendChild(renderer.domElement);
    
    // 设置相机位置
    camera.position.z = 5;
    
    // 创建一个立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // 示例1: 使用Tween.js控制位置
    // 创建一个位置动画，让立方体在x轴上来回移动
    const positionTween = new TWEEN.Tween(cube.position)
      .to({ x: 2 }, 2000) // 2秒内移动到x=2的位置
      .easing(TWEEN.Easing.Quadratic.InOut) // 使用二次缓动函数
      .yoyo(true) // 来回运动
      .repeat(Infinity); // 无限重复
    
    // 示例2: 使用Tween.js控制旋转
    // 创建一个旋转动画，让立方体绕轴旋转
    const rotationTween = new TWEEN.Tween(cube.rotation)
      .to({ x: Math.PI * 2, y: Math.PI * 2 }, 5000) // 5秒内旋转一圈
      .easing(TWEEN.Easing.Exponential.InOut) // 使用指数缓动函数
      .repeat(Infinity); // 无限重复
    
    // 示例3: 使用Tween.js控制材质颜色
    // 创建一个颜色对象，用于动画
    const colorObj = { r: 0, g: 1, b: 0 }; // 初始颜色 (绿色)
    const colorTween = new TWEEN.Tween(colorObj)
      .to({ r: 1, g: 0, b: 1 }, 3000) // 3秒内变为紫色
      .easing(TWEEN.Easing.Cubic.InOut) // 使用三次方缓动函数
      .yoyo(true) // 来回变化
      .repeat(Infinity) // 无限重复
      .onUpdate(() => {
        // 在每次更新时修改材质颜色
        (material as THREE.MeshBasicMaterial).color.setRGB(colorObj.r, colorObj.g, colorObj.b);
      });
    
    // 启动所有动画
    positionTween.start();
    rotationTween.start();
    colorTween.start();
    
    // 动画循环函数
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 关键点: 在每一帧更新Tween动画
      // 这是连接Three.js渲染循环和Tween.js动画系统的关键
      TWEEN.update();
      
      // 渲染Three.js场景
      renderer.render(scene, camera);
    };
    
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
      // 停止动画循环
      positionTween.stop();
      rotationTween.stop();
      colorTween.stop();
      
      // 移除渲染器
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // 移除事件监听器
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div>
      <div ref={canvasRef} style={{ width: '100%', height: '100vh' }}></div>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '300px'
      }}>
        <h2>Three.js + Tween.js 关系演示</h2>
        <p>此示例展示了Three.js和Tween.js如何协同工作：</p>
        <ul>
          <li><strong>位置动画</strong>：立方体在x轴上来回移动</li>
          <li><strong>旋转动画</strong>：立方体围绕x轴和y轴旋转</li>
          <li><strong>颜色动画</strong>：立方体颜色在绿色和紫色之间变化</li>
        </ul>
        <p><strong>关键点</strong>：在Three.js的动画循环中调用<code>TWEEN.update()</code>来更新所有Tween动画</p>
      </div>
    </div>
  );
};

export default SimpleTweenDemo;
