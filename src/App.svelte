<script>
  import bgImg from "./assets/bg-img.svg"
  import projects from "./assets/groups.json"

  let mouseX = 0;
  let mouseY = 0;

  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

</script>

<main class="min-h-screen w-full relative flex flex-col items-center gap-16 py-8 justify-center" on:mousemove={handleMouseMove} style="background-image: url({bgImg});">
  <div class="bg-[rgba(255,255,255,.3)] w-[32rem] aspect-square rounded-full blur-[256px] absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style="left: {mouseX}px; top: {mouseY}px;"></div>
    
  <h1 class="text-center text-5xl text-orange-50 font-bold">
    Projets SI
  </h1>

  <div class="w-full flex-1 container flex items-center justify-center">
    
    <ul class="flex flex-wrap gap-16 items-center justify-center" id="website-list">
      {#each projects as item }
        <li style="background-image: url('/src/assets/projects-images/{item.img}');">
          <a href="http://{item.url}">
            <div class="p-4 text-center text-emerald-50 text-xl font-semibold">
              {item.name}
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Coustard:wght@400;900&family=Figtree:ital,wght@0,300..900;1,300..900&family=Reddit+Mono:wght@200..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

  #website-list > li {
    @apply basis-1/3 border-2 rounded-lg bg-cover border-emerald-700;
  }

  main {
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
  }
</style>