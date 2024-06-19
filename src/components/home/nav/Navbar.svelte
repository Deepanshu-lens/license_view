<script lang="ts">
import {mode} from 'mode-watcher'
</script>

<header class="px-16 absolute bg-transparent top-0 left-0 z-20 h-[75px] hidden sm:flex w-full">
    <nav class="flex items-center justify-between p-4 w-full h-full">
        <img
        src={$mode === "light" ? "/images/green.svg" : "/images/white.svg"}
        alt="logo"
        class="w-24"
        />
        <div class="flex items-center gap-4">
            <a href="/login" class="bg-primary px-4 py-1 rounded-2xl text-white font-medium">
            Login
            </a>
            <!-- <button class="bg-primary px-4 py-1 rounded-2xl text-white font-medium">
                Take a Tour
            </button> -->
        </div>
    </nav>
</header>