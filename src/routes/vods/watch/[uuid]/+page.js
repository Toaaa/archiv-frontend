import { error } from '@sveltejs/kit';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function load({ params, fetch }) {
    const response = await fetch(`${BACKEND_URL}/vods/${params.uuid}`);
    const resp = await response.json();
    const vod = resp.result;
    if (!vod.uuid) {
        throw error(404, `Vod "${params.uuid}" nicht gefunden`);
    }
    return { vod };
}
