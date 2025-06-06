import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import styles from './index.module.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
    camera.position.set(0, 2, 5); // 调整相机位置以便更好地查看模型

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
    const loader2 = new GLTFLoader()

    // // 加载 FBX 文件
    // loader.load('/models/ball3.fbx', (object) => {
    //   // 使用简单的线框材质
    //   object.traverse((child) => {
    //     if (child instanceof THREE.Mesh) {
    //       child.material = new THREE.MeshPhongMaterial({ 
    //         color: 0xff0000, 
    //         shininess: 150 
    //       }); // 红色高光材质
    //     }
    //   });


    //   scene.add(object);
    // }, undefined, (error) => {
    //   console.error('Error loading FBX file:', error);
    // });

    // 加载 gltf 文件
    loader2.load('/models/ApolloSoyuz.glb', (gltf) => {
      const model = gltf.scene;
      
      // 遍历模型中的所有对象
      model.traverse((child) => {
        // 检查是否是网格对象
        if (child instanceof THREE.Mesh) {
          // 现在可以访问和修改网格对象的属性
          console.log('Mesh found:', child.name);
          
          // 可以修改材质
          // child.material = new THREE.MeshStandardMaterial({ 
          //   color: 0x00ff00,
          //   metalness: 0.5,
          //   roughness: 0.5
          // });
          
          // 可以启用阴影
          child.castShadow = true;
          child.receiveShadow = true;
          
          // 可以访问几何体信息
          console.log('Vertices:', child.geometry.attributes.position.count);
          
          // 可以添加动画或其他行为
          // child.userData.animateRotation = true;
        }
      });
      
      // 调整模型的位置、缩放和旋转
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1); // 根据需要调整缩放
      model.rotation.y = Math.PI / 4; // 旋转45度
      
      // 将模型添加到场景
      scene.add(model);
    }, 
    // 加载进度回调
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, 
    // 错误回调
    (error) => {
      console.error('Error loading GLTF file:', error);
    });

    // 渲染循环
    function animate() {
      requestAnimationFrame(animate);
      
      // 可以在这里添加模型动画
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.userData.animateRotation) {
          object.rotation.y += 0.01;
        }
      });
      
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
