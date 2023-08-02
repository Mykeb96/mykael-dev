import './App.css'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'
import * as THREE from 'three'
import { Stars } from '@react-three/drei/core/Stars'
import { MeshDistortMaterial, Text, CameraControls } from '@react-three/drei'
import { useState, useEffect } from 'react'
import {IoMdArrowRoundBack} from 'react-icons/io'
import {AiFillHome} from 'react-icons/ai'
import {FaGithubSquare, FaLinkedin} from 'react-icons/fa'
import {MdEmail} from 'react-icons/md'
import Projects from './projects'

function Planet({posX, posY, posZ, map, rotateSpeed, label, setRenderPlanet, setRenderPage}: any) {

  const myMesh = useRef<Mesh>(null!);

  const colorMap = useLoader(TextureLoader, map)

  const [meshMaterial, setMeshMaterial] = useState<string>('')
  const [hovered, setHovered] = useState<boolean>(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])
  
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.y = a * rotateSpeed;
  });

  return (

    <mesh ref={myMesh} geometry={new THREE.SphereGeometry(1, 16, 16)} position={new THREE.Vector3(posX, posY, posZ)} 
    onPointerEnter={(e) => {
      setMeshMaterial(e.eventObject.name)
      setHovered(true)
    }} 
    onPointerLeave={() => {
      setMeshMaterial('')
      setHovered(false)
    }}
    onClick={() => {
      setRenderPlanet(false)
      setRenderPage(myMesh.current.name)
      document.body.style.cursor = 'auto'
    }}
    name={label}>
      {myMesh.current != null && meshMaterial == myMesh.current.name ? <MeshDistortMaterial distort={0.5} speed={5} map={colorMap}/> : <meshPhongMaterial map={colorMap}/>}
    </mesh>

  );
}

function NewControls({setDoRender, renderPage}: any){

  const myCamera = useRef<CameraControls>(null!);

  useEffect(() => {
        setDoRender(false)
        myCamera.current.setPosition(0, 0, 350)
  }, [])
  
  useFrame(() => {
    if (myCamera.current.camera.position.z > 5){
      myCamera.current.setPosition(0, 0, myCamera.current.camera.position.z - 5)
    } else {
      if (renderPage != ''){
        setDoRender(true)
      }
    }
  });

  return (
    <CameraControls ref={myCamera} interactiveArea={{x: 0, y: 0, width: 0, height: 0}}/>
  )
}

function App() {

  const [renderPlanet, setRenderPlanet] = useState<boolean>(true)
  const [renderPage, setRenderPage] = useState<string>('')
  const [doRender, setDoRender] = useState<boolean>(false)

  const [contactHovered, setContactHovered] = useState<string>('')

  let target1: any = document.querySelectorAll('.skills-list')[0]
  let target2: any = document.querySelectorAll('.skills-list')[1]
  const motionMatchMedia = window.matchMedia("(prefers-reduced-motion)");
  const THRESHOLD = 15;

  useEffect(() => {
    let target1 = document.querySelectorAll('.skills-list')[0]
    let target2 = document.querySelectorAll('.skills-list')[1]
  },[])

  function handleHover(e: any) {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;
  
    const horizontal = (clientX - offsetLeft) / clientWidth;
    const vertical = (clientY - offsetTop) / clientHeight;
    const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
    const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

    if (currentTarget.id == 'list1') target1.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
    if (currentTarget.id == 'list2') target2.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
    
  }
  
  function resetStyles(e: any) {
      target1.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
      target1.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;

      target2.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
      target2.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
  }
  
  if (!motionMatchMedia.matches && target1 && target2) {
    target1.addEventListener("mousemove", handleHover);
    target1.addEventListener("mouseleave", resetStyles);
    target2.addEventListener("mousemove", handleHover);
    target2.addEventListener("mouseleave", resetStyles);
  }

  return (
    <div id='main-container'>
      {renderPage != '' ? 
        <div className='back-container' onClick={() => {
          setRenderPlanet(true)
          setRenderPage('')
          setDoRender(false)
        }}>
          <IoMdArrowRoundBack className='back-arrow'/>
          <AiFillHome />
        </div> 
      :
      null
      }

      <div className='main-header'>
        <img src='/mykael_barnes.PNG' id='mykael'/>
        <div className='name-title'>
          <h1>Mykael Barnes</h1>
          <h6>Full-Stack Web Developer</h6>
        </div>
      </div>
      <div id="canvas-container">
        {renderPlanet ?
          <Canvas style={{ background: 'black'}}>
            <Text color="white" position={[3.2, 0.9, 2]} scale={[0.4, 0.4, 0.4]} rotation={[0, 0, -0.3]} font='/Oswald-Bold.ttf'>
              Projects
            </Text>
            <Planet posX={2.3} posY={-0.5} posZ={2} map={'/mars.jpg'} rotateSpeed={0.2} label={'projects'} setRenderPlanet={setRenderPlanet} setRenderPage={setRenderPage}/>
            <Text color="white" position={[-8, -3.3, -5]} scale={[0.4, 0.4, 0.4]} font='/Oswald-Bold.ttf'>
              Contact
            </Text>
            <Planet posX={-8} posY={-5} posZ={-5} map={'/mercury.jpg'} rotateSpeed={0.5} label={'contact'} setRenderPlanet={setRenderPlanet} setRenderPage={setRenderPage}/>
            <Text color="white" position={[-2.2, 1.4, -2]} scale={[0.4, 0.4, 0.4]} rotation={[0, 0, 0.5]} font='/Oswald-Bold.ttf'>
              Skills
            </Text>
            <Planet posX={-1.5} posY={0} posZ={-2} map={'/jupiter.jpg'} rotateSpeed={0.7} label={'skills'} setRenderPlanet={setRenderPlanet} setRenderPage={setRenderPage}/>
            <ambientLight intensity={0.1} />
            <directionalLight color="grey" position={[0, 0, 5]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
            <NewControls setDoRender={setDoRender} renderPage={renderPage}/>
          </Canvas>
          :
          <Canvas style={{ background: 'black'}}>
            <ambientLight intensity={0.1} />
            <directionalLight color="grey" position={[0, 0, 5]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
            <NewControls setDoRender={setDoRender} renderPage={renderPage}/>
          </Canvas>
        }
      </div>
      {renderPage == 'skills' && doRender ?
        <div className='skills-container'>

          <div className='skills-list' id='list1'>
            <ul>
              <li>HTML, CSS</li>
              <li>Javascript, Typescript, C#, GDscript</li>
              <li>ReactJS, NextJS, Vite, Vercel, THREE</li>
              <li>Wordpress, Shopify</li>
            </ul>
          </div>   

          <div className='skills-list' id='list2'>
            <ul>
              <li>Git, Github</li>
              <li>Node, Prisma, Express, Postman, SQL</li>
              <li>tRPC, REST, GraphQL</li>
              <li>Jest, Cypress</li>
            </ul>
          </div>

        </div>
        :
        null
      }

      {renderPage == 'contact' && doRender ?
        <div className='contact-container'>
          <span className='contact-hovered'>{contactHovered ? contactHovered : '‎'}</span>
          <div className='contact-icons'>
            <a href='https://github.com/Mykeb96' target="_blank"><FaGithubSquare className='icon' onPointerEnter={() => setContactHovered('Github')} onPointerLeave={() => setContactHovered('')}/></a>
            <a href='https://www.linkedin.com/in/mykael-barnes/' target="_blank"><FaLinkedin className='icon' onPointerEnter={() => setContactHovered('Linkedin')} onPointerLeave={() => setContactHovered('')}/></a>
            <a href = "mailto: mykael.barnes@hotmail.com"><MdEmail className='email-icon icon'  onPointerEnter={() => setContactHovered('Email')} onPointerLeave={() => setContactHovered('')}/></a>
          </div>
        </div>
        :
        null
      }

      {renderPage == 'projects' && doRender ?
        <div className='projects-container'>
          {Projects.map((project) => 
          <a href={project.url} target="_blank"><div className='project'>
            <span>{project.title}</span>
            <span>{project.description}</span>
          </div></a>

          )}
        </div>
        :
        null
      }

    </div>
  )
}

export default App
