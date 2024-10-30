<script>
  export let data;
  console.log(data, "data here");
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
    <h1 class="text-2xl font-bold text-center text-green-600">
      Payment Successful!
    </h1>
    <div class="mt-4 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-green-600 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12l2 2 4-4m2-2a9 9 0 11-9 9 9 9 0 019-9z"
        />
      </svg>
      <p class="mt-2 text-gray-600">
        Thank you for your payment. Your transaction has been completed
        successfully.
      </p>
    </div>

    <div class="mt-6">
      <button
        class="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition duration-200"
        on:click={() =>
          (window.location.href = `/session/${data?.token}?payment=success`)}
      >
        Return to Homepage
      </button>
    </div>
  </div>
</div>
