import * as THREE from 'three';

export type RaceTelemetry = {
  position: number; speed: number; stamina: number; distance: number;
  totalDistance: number; state: 'READY' | 'RACING' | 'FINISHED'; horseName: string;
};
type Runner = { group: THREE.Group; player: boolean; lane: number; progress: number; speed: number; stamina: number; phase: number; color: number; };

const TOTAL = 1600;
const RADIUS_X = 48;
const RADIUS_Z = 25;

function material(color: number, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

function makeHorse(coat: number, silk: number): THREE.Group {
  const root = new THREE.Group();
  const coatMat = material(coat), dark = material(0x241a16), silkMat = material(silk);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 1.05, 5, 10), coatMat);
  body.rotation.z = Math.PI / 2; body.position.y = 1.35; root.add(body);
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), coatMat);
  chest.scale.set(0.75, 1.05, 0.8); chest.position.set(0.62, 1.34, 0); root.add(chest);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.38, 1.05, 10), coatMat);
  neck.position.set(0.92, 1.72, 0); neck.rotation.z = -0.48; root.add(neck);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.8, 10), coatMat);
  head.position.set(1.28, 1.95, 0); head.rotation.z = -1.1; root.add(head);
  const mane = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.16), dark);
  mane.position.set(0.82, 2.12, 0); mane.rotation.z = -0.4; root.add(mane);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.85, 8), dark);
  tail.position.set(-0.9, 1.55, 0); tail.rotation.z = 1.8; root.add(tail);
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.52), silkMat);
  saddle.position.set(-0.05, 1.78, 0); root.add(saddle);
  // Simplified stylised jockey silhouette.
  const riderBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.42, 4, 8), silkMat);
  riderBody.position.set(0.05, 2.05, 0); riderBody.rotation.z = -0.5; root.add(riderBody);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), material(0xf0e8d8));
  helmet.position.set(0.32, 2.35, 0); root.add(helmet);
  const legs: THREE.Mesh[] = [];
  for (const x of [-0.55, 0.45]) for (const z of [-0.23, 0.23]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.85, 7), coatMat);
    leg.position.set(x, 0.82, z); root.add(leg); legs.push(leg);
  }
  root.userData.legs = legs;
  root.scale.setScalar(0.92);
  return root;
}

function ovalPoint(progress: number, lane: number) {
  const t = progress * Math.PI * 2;
  const rx = RADIUS_X + lane * 1.7, rz = RADIUS_Z + lane * 1.7;
  return new THREE.Vector3(Math.cos(t) * rx, 0, Math.sin(t) * rz);
}

function makeTrack(scene: THREE.Scene) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 150), material(0x244438));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.18; scene.add(ground);
  const outer = new THREE.Mesh(new THREE.RingGeometry(0, 1, 128), material(0x39724d));
  outer.rotation.x = -Math.PI / 2; outer.scale.set(RADIUS_X + 10, RADIUS_Z + 10, 1); outer.position.y = -0.08; scene.add(outer);
  const track = new THREE.Mesh(new THREE.RingGeometry(0.72, 1, 128), material(0x4c8a58));
  track.rotation.x = -Math.PI / 2; track.scale.set(RADIUS_X + 8, RADIUS_Z + 8, 1); track.position.y = -0.03; scene.add(track);
  // Turf oval surface.
  const turf = new THREE.Mesh(new THREE.RingGeometry(0.72, 1, 128), material(0x6eaa68));
  turf.rotation.x = -Math.PI / 2; turf.scale.set(RADIUS_X + 5, RADIUS_Z + 5, 1); turf.position.y = 0.005; scene.add(turf);
  // Inner field.
  const infield = new THREE.Mesh(new THREE.CircleGeometry(1, 96), material(0x39734d));
  infield.rotation.x = -Math.PI / 2; infield.scale.set(RADIUS_X * 0.73, RADIUS_Z * 0.73, 1); infield.position.y = 0.015; scene.add(infield);
  // Rails represented by two continuous elliptical curves.
  for (const offset of [2.5, 8.0]) {
    const points: THREE.Vector3[] = [];
    for (let i=0;i<=160;i++) points.push(new THREE.Vector3(Math.cos(i/160*Math.PI*2)*(RADIUS_X+offset), 0.3, Math.sin(i/160*Math.PI*2)*(RADIUS_Z+offset)));
    const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 180, 0.12, 5, false), material(0xf0eee2));
    scene.add(rail);
  }
  // Finish stripe across the front straight.
  const finish = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.025, 17), new THREE.MeshStandardMaterial({color:0xffffff}));
  finish.position.set(RADIUS_X + 1, 0.04, 0); scene.add(finish);
  // Simple grandstand blocks.
  const stand = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 7), material(0xaaa99a));
  stand.position.set(5, 2.3, -RADIUS_Z - 16); scene.add(stand);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(33, 0.7, 9), material(0x293c38));
  roof.position.set(5, 5.1, -RADIUS_Z - 16); scene.add(roof);
}

export function createRacingScene(container: HTMLElement, onTelemetry: (data: RaceTelemetry) => void) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fc4c4);
  scene.fog = new THREE.Fog(0x9fc4c4, 100, 230);
  const camera = new THREE.PerspectiveCamera(58, container.clientWidth / container.clientHeight, 0.1, 500);
  camera.position.set(0, 16, 38);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.prepend(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xeaf5ed, 0x35533d, 2.0));
  const sun = new THREE.DirectionalLight(0xfff1d4, 2.3);
  sun.position.set(-35, 65, -25); sun.castShadow = true; scene.add(sun);
  makeTrack(scene);

  const colors = [0x75402b,0x4c3026,0x8a4c32,0x3b2924,0x6d3928,0x965d3b];
  const silks = [0xd8b34d,0x315c91,0xb5443d,0xe5e0d4,0x447b55,0x653d80];
  const runners: Runner[] = [];
  for (let i=0;i<6;i++) {
    const group = makeHorse(colors[i], silks[i]);
    scene.add(group);
    runners.push({group, player:i===0, lane:i, progress:0.005 + i*0.0009, speed:0, stamina:100, phase:i*0.8, color:colors[i]});
  }

  let running = false, finished = false, cameraMode: 'chase'|'jockey' = 'chase';
  const keys = new Set<string>();
  let last = performance.now(), elapsed = 0;
  const player = runners[0];
  const updateTelemetry = () => {
    const sorted = [...runners].sort((a,b)=>b.progress-a.progress);
    onTelemetry({
      position: sorted.indexOf(player)+1, speed: player.speed*3.6,
      stamina: player.stamina, distance: Math.min(TOTAL, player.progress * TOTAL),
      totalDistance: TOTAL, state: finished ? 'FINISHED' : running ? 'RACING' : 'READY',
      horseName: 'Southern Comet'
    });
  };
  const reset = () => {
    running=false; finished=false; elapsed=0;
    runners.forEach((r,i)=>{r.progress=0.005+i*0.0009;r.speed=0;r.stamina=100;r.lane=i;r.group.position.set(0,0,0);});
    updateTelemetry();
  };
  const start = () => { if (!finished) running=true; updateTelemetry(); };
  (window as any).__ajStart = start;
  (window as any).__ajReset = reset;
  (window as any).__ajCamera = (mode: 'chase'|'jockey') => cameraMode=mode;

  const resize = () => {
    const w=container.clientWidth,h=container.clientHeight;
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);
  };
  const observer = new ResizeObserver(resize); observer.observe(container);

  const animate = (now:number) => {
    const dt=Math.min((now-last)/1000,0.04);last=now;elapsed+=dt;
    if (running && !finished) {
      const pace = (keys.has('w')||keys.has('arrowup')) ? 1 : (keys.has('s')||keys.has('arrowdown')) ? -0.6 : 0;
      const urging = keys.has(' ');
      const conserving = keys.has('shift');
      const steering = (keys.has('a')||keys.has('arrowleft')?-1:0)+(keys.has('d')||keys.has('arrowright')?1:0);
      const target = 10.5 + pace*5.0 + (urging?4.2:0) - (conserving?3.0:0);
      const accel = player.stamina < 20 ? 2.0 : 4.0;
      player.speed += THREE.MathUtils.clamp(target-player.speed,-accel*dt,accel*dt);
      player.speed=Math.max(0,player.speed);
      player.lane=THREE.MathUtils.clamp(player.lane+steering*dt*1.15,0,5);
      const effort = urging ? 1.9 : pace>0 ? 1.2 : conserving ? 0.45 : 0.8;
      player.stamina=THREE.MathUtils.clamp(player.stamina-(effort*Math.max(0.25,player.speed/12))*dt*1.35,0,100);
      if (player.stamina<18) player.speed=Math.min(player.speed,10.8+player.stamina*0.12);
      player.progress += player.speed*dt/TOTAL;
      runners.slice(1).forEach((r,i)=>{
        const strategy = [0.7,0.25,0.5,0.9,0.35][i];
        const desired=10.2+Math.sin(elapsed*0.32+i*1.7)*0.7+(r.stamina>35?strategy: -0.6);
        r.speed += THREE.MathUtils.clamp(desired-r.speed,-2.6*dt,2.6*dt);
        r.stamina=THREE.MathUtils.clamp(r.stamina-(r.speed>10.8?0.9:0.45)*dt,0,100);
        if (r.stamina<18) r.speed*=0.999;
        r.progress += r.speed*dt/TOTAL;
      });
      if (player.progress>=1 || runners.some(r=>r.progress>=1)) { finished=true;running=false; }
      updateTelemetry();
    }
    runners.forEach((r)=>{
      const p=ovalPoint(r.progress,r.lane);
      const next=ovalPoint(r.progress+0.001,r.lane);
      r.group.position.set(p.x,0,p.z);
      r.group.rotation.y=Math.atan2(next.x-p.x,next.z-p.z);
      const speedFactor=running?Math.max(0.2,r.speed/11):0.12;
      const legs=r.group.userData.legs as THREE.Mesh[];
      legs.forEach((leg,i)=>{leg.rotation.z=Math.sin(elapsed*10*speedFactor+r.phase+(i%2)*Math.PI)*0.48;});
      r.group.position.y=Math.abs(Math.sin(elapsed*10*speedFactor+r.phase))*0.045;
    });
    const pp=player.group.position;
    if (cameraMode==='chase') {
      const behind=new THREE.Vector3(-Math.cos(player.progress*Math.PI*2),0,-Math.sin(player.progress*Math.PI*2));
      const target=new THREE.Vector3(pp.x,1.2,pp.z);
      const desired=target.clone().add(behind.multiplyScalar(13)).add(new THREE.Vector3(0,7,0));
      camera.position.lerp(desired,0.08);camera.lookAt(target);
    } else {
      const forward=new THREE.Vector3(Math.cos(player.progress*Math.PI*2),0,Math.sin(player.progress*Math.PI*2));
      const desired=new THREE.Vector3(pp.x,3.1,pp.z).add(forward.clone().multiplyScalar(1.1));
      camera.position.lerp(desired,0.12);camera.lookAt(new THREE.Vector3(pp.x+forward.x*18,1.2,pp.z+forward.z*18));
    }
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
  updateTelemetry();

  return {
    keyDown(key:string){keys.add(key.toLowerCase());},
    keyUp(key:string){keys.delete(key.toLowerCase());},
    setCamera(mode:'chase'|'jockey'){cameraMode=mode;},
    reset,
    dispose(){observer.disconnect();renderer.dispose();container.removeChild(renderer.domElement);delete (window as any).__ajStart;delete (window as any).__ajReset;delete (window as any).__ajCamera;}
  };
}