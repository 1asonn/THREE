import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import styles from './index.module.css';

const MeshPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景、相机和渲染器
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // 设置相机位置
   


    camera.position.set(0, 0, 5);
    camera.position.z = 1000;
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 添加坐标轴和网格
    scene.add(new THREE.AxesHelper(5));
    scene.add(new THREE.GridHelper(10, 10));

    // 创建 FBXLoader 实例
    const loader = new FBXLoader();

    // 加载 FBX 文件
    loader.load('/models/ball3.fbx', (object) => {
      // 使用简单的线框材质
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshPhongMaterial({ 
            color: 0xff0000, 
            shininess: 150 
          }); // 红色高光材质
        }
      });


      scene.add(object);
    }, undefined, (error) => {
      console.error('Error loading FBX file:', error);
    });

    // 渲染循环
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // 清理函数
    return () => {
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Three.js FBX Mesh Model</h1>
      <div className={styles.threeContainer} ref={containerRef}></div>
    </div>
  );
};

export default MeshPage;
