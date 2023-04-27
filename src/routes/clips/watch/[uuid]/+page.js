import { error } from '@sveltejs/kit';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export async function load({ params, fetch }) {
    const response = await fetch(`${BACKEND_URL}/clips/${params.uuid}`);
    const resp = await response.json();
    const clip = resp.result;
    if (!clip.uuid) {
        throw error(404, `Clip '${params.uuid}' nicht gefunden \n Vielleicht nach Vod gesucht? ${FRONTEND_URL}/vods/watch/${params.uuid}`);
    }
    return { clip };
}
