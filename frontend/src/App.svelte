<script>
  import bgImg from "./assets/bg-img.svg"
  import projects from "./assets/groups.json"
  import bird from "./assets/bird.svg"

  let mouseX = 0;
  let mouseY = 0;

  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  $: outerWidth = 0
	$: innerWidth = 0
	$: outerHeight = 0
	$: innerHeight = 0

  let birdX = 0;
  let birdTimeout = null;

  $: computedBirdPos = outerWidth+birdX

  function updateTimeoutBird() {
    return setTimeout(()=>{
        birdX = birdX - 8;
        if (outerWidth+birdX > -200) {
          birdTimeout = updateTimeoutBird()
          return 
        }
        else {
          birdX = 0;
          birdTimeout = null;
        }
      }, 10)
  }

  function projectClick() {
    if (birdTimeout === null) {
      makeBirds();
      updateTimeoutBird();
    }
  }

  function randomDelay() {
    return Math.floor(Math.random() * -200);
  }

  let birds = []
  makeBirds();

  function makeBirds() {
    birds = []
    for (let index = 0; index < 4; index++) {
      birds = [...birds, {
          pos: index*40, 
          delay: randomDelay(), 
          duration: (Math.random() * (1500 - 750) + 750).toFixed(0),
          scale: (Math.random() * (1.2 - 0.8) + .8).toFixed(2),
        },
      ];
    }
    console.log(birds)
  }


  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';

  let message = '';
  let scores = [];

  // Create socket connection
  let socket;

  onMount(() => {
    socket = io('http://localhost:3000'); // Replace with your backend URL

    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('message', message);
    });

    // Listen for server responses
    socket.on('response', (res) => {
      scores = res;
    });
  });

  // Emit a message to the server
  function sendMessage() {
    socket.emit('message', message);
    message = ''; // Clear message input after sending
  }

  // Cleanup when the component is destroyed
  onDestroy(() => {
    socket.disconnect();
  });

</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />

<main class="min-h-screen w-full relative flex flex-col items-center gap-16 py-8 justify-center" on:mousemove={handleMouseMove} style="background-image: url({bgImg});">
  <div class="bg-[rgba(255,255,255,.3)] w-[32rem] aspect-square rounded-full blur-[256px] absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style="left: {mouseX}px; top: {mouseY}px;"></div>
  
  {#each birds as item }
    <img class="absolute inset-0 w-8 aspect-square bird" style="
    left: {computedBirdPos+item.pos}px;
    top: 3rem;
    animation-delay:{item.delay}ms;
    animation-duration:{item.duration}ms;
    scale: {item.scale};
    " src="{bird}" />
  {/each}

  <button class="text-center text-5xl text-orange-50 font-bold" on:click={projectClick}>
    <h1>Projets SI</h1>
  </button>

  <div class="w-full flex-1 container h-fit">
    
    <ul class="flex flex-wrap gap-6 items-center justify-center" id="website-list">
      {#each projects as item }
        <li style="background-image: url('/src/assets/projects-images/{item.img}');" class="z-10">
          <a href="http://{item.url}">
            <div class="p-4 text-center text-emerald-50 text-xl font-semibold">
              {item.name}
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </div>

  <div>
    <textarea bind:value={message} placeholder="Type a message"></textarea>
    <button on:click={sendMessage}>Send</button>
  </div>

  <div>
    <h2>LeaderBoard</h2>
    <ul>
      {#each scores as s}
        <li>{s}</li>
      {/each}
    </ul>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Coustard:wght@400;900&family=Figtree:ital,wght@0,300..900;1,300..900&family=Reddit+Mono:wght@200..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

  #website-list > li {
    @apply basis-1/4 border-2 rounded-lg bg-cover border-emerald-700 hover:scale-105 duration-300;
  }

  main {
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
  }

  @keyframes birdYMovement {
    0% {
      transform: translateY(-2rem);
    }
    100% {
      transform: translateY(2rem);
    }
  }

  .bird {
    animation: birdYMovement infinite ease-in-out alternate;
  }
</style>