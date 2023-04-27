<script>
    import { page } from '$app/stores';
</script>

<h1 class="text-center">{$page.status}</h1>
<h2 class="text-center mt-4">{$page.error.message}</h2>
