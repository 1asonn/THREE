import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

const FixedTweenDemo: React.FC = () => {
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
    
    // 设置相机位置 - 调整位置以更好地观察动画
    camera.position.set(0, 0, 8); // 增加z距离，使视野更广
    
    // 添加光照
    const ambientLight = new THREE.AmbientLight(0x404040); // 柔和的环境光
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 方向光
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // 创建一个立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 使用MeshPhongMaterial代替MeshBasicMaterial，以支持光照
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00, // 绿色
      shininess: 100, // 高光度
      specular: 0x111111 // 高光颜色
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // 创建一个更明显的位置动画
    const tween = new TWEEN.Tween(cube.position)
      .to({ x: 3 }, 2000) // 增大移动距离
      .easing(TWEEN.Easing.Quadratic.InOut)
      .yoyo(true)
      .repeat(Infinity);
      
    // 添加旋转动画，使效果更明显
    const rotationTween = new TWEEN.Tween(cube.rotation)
      .to({ x: Math.PI, y: Math.PI }, 3000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .repeat(Infinity);
    
    // 启动所有动画
    tween.start();
    rotationTween.start();
    
    // 动画循环函数
    function animate() {
      requestAnimationFrame(animate);
      
      // 更新Tween动画 - 这是关键
      TWEEN.update();
      
      // 添加简单的旋转，使动画更加明显
      cube.rotation.z += 0.01;
      
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
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
        <h2>Three.js + Tween.js 修复版</h2>
        <p>这是一个简化的演示，专注于解决动画问题</p>
      </div>
    </div>
  );
};

export default FixedTweenDemo;
