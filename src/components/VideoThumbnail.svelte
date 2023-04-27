<script>
    import { onMount } from 'svelte';
    import { toHHMMSS } from '/src/functions';

    export let type;
    export let filename;
    export let title;
    export let uuid;
    export let duration;
    export let loading;
    export let offset;
    export let highres;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    let avifSm;
    let avifMd;
    let jpg;
    let watched = {
        vods: {},
        clips: {}
    };

    onMount(() => {
        if (!localStorage.getItem('watched')) {
            localStorage.setItem('watched', JSON.stringify(watched));
        }
        watched = JSON.parse(localStorage.getItem('watched'));
    });

    function showPrev() {
        if (highres === 'false') {
            avifSm.srcset = `${BACKEND_URL}/media/${type}/${filename}-preview.webp`;
        }
        avifMd.srcset = `${BACKEND_URL}/media/${type}/${filename}-preview.webp`;
    }

    function hidePrev() {
        if (highres === 'false') {
            avifSm.srcset = `${BACKEND_URL}/media/${type}/${filename}-sm.avif`;
        }
        avifMd.srcset = `${BACKEND_URL}/media/${type}/${filename}-md.avif`;
    }
</script>

<a href="/{type}/watch/{uuid}{offset ? `?t=${offset}` : ''}">
    <!-- https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md -->
    <div class="position-relative">
        <picture
            id={filename}
            class="has-preview"
            on:mouseover={() => showPrev()}
            on:focus={() => showPrev()}
            on:mouseout={() => hidePrev()}
            on:blur={() => hidePrev()}
        >
                            <!-- onerror="this.onerror=null;this.type='image/jpg';this.bind:this={jpg};this.src='data:image/jpg;base64,UklGRsYHAABXRUJQVlA4TLoHAAAvV8JjAAVd1drC2tb7v1sqK5s0FgGLEAgifxAJnOj3/RrXuueuC9eI/lOQJDluJAXmvjYqAUJUEdoHLD+rMf1n+s/0n+k/03+m/0z/mf4z/Wf6z/Sf6T/Tf6b/TP+Z/jP9Z/rP9J/pP9N/pv9M/5n+M/1n+s+PH+uPKCLbrwkT7mp8aXZRjvXBi5wjs4pEM9L0xyetklPEv+HcACqmMUM7Gtc9IqfI8THc2nE8pD8CbmDCU95AuCetWL5uPYvgDeeGF8MuxRzvZdhUSU0ebZF9Be7BkRGRUuElpNnt40gPp/sz7Jfm0rL99bOCyV+WL83iqrEXq7cadvm+rMXujnjD+cvg/pCWb0nfCfvCLKtzbkG84fyZNBYif3UMnOALxfyXjN2DiBwbxosEReOI9MPcKSKnNw/IXYPxhSCv6ixkY1GwqgNeVmGoK6Sh8bUeIhKPlddJUtxDEZqlFNqRaj+xpec2TEQ0rUBF7I7OmPFljcDXxKqQXLUwKxdHQ9xrzVJte+oPO33XCpPiwIltmp6BQf3m5NlidHyjgP0wE+uuz066QMlRjlwLHoikKJjMQrj1rk3YwmaV2lmcyrn0Bm53sAC99nqzUS4zdVBpozNmAqqx+sFOCwlV1cKXRHUtFkpbYlGpQhRLWQXNX9P0jMqecLStIKXzIrIBunvMKdDoMqTgrCi4msCsdW3GFUXfJAHqrFpP2RPtrNF2lEPBhm1PwoqVcrkpHRRp5XgIGv3KiggRyBxcpmV6BiWza7YTfIYD0VhrFFVdpqFJHOA0UNeOKIbXsXM5SNYZZYZTfGVeGbIy57wqN952iqH9cipKvhvmr2V6xuQJ0jvnvJS1dSQA2Vzs8M65cs8VRGFVNLPPIuvYo2BTCMoGyji6E5DybTU4RcWuWds450IRtLIrb4ug0u6c2wJb8yaDGveixqs0rQq5qkKa0UxfApcSDRHiUIpH+UyhaXoGxeMLK3cBX6uBXIXmgvEIuT5toeRaCsYSO7wpyqYb9R4CA4kaLlyxe5ZHatFu/GvY8ASFYM7iBZ4Eqvpr7ZDpMxfWT7iwnfD4JZLi2pLvmOwLueHxPSC2Qq40WzhBklnwBihNBaNL/ySuW1/QS1Ms8lA6eybrWrR7YNndwwoxxTMikm56BTp9Cel7FuJegKYvW5JiaJqeEUnQ44kqdCKz27BAdo0IcQsztO0FLwaXez7ldiXQheYhIBfhhz1atHuwF1s5TAqx12+E4Na1voVXTl+kthciMllTrJWWfEfkpItWOhH1eXimnnCZ+TFsKlg1ju4o+nacROVMlGhbtHsgNEKLiFUlRP4tDFRChfGoPCIDWbiOWvIdkY2q5U4cNF69esDER7ilYI5x+/ksv9gVQ6OKFFPLddNuhZ6d0107hpYWXuLiV9CuPKrmABbJInvfku+Q/ViuNgI3vgB5ci0F0z4/6it1ZaEIhCh30+6B4rZIyDYmcFxPJS8hnEN7FuMBbRC45ufaOlry/QdAuuCLs2oDIwOyqOFjSEQPH38BrPjBQ/oh4av2oxy7M8sxJOmzOT+a7Sshw3A2Y/NDAG2AL/nLDnMRHBvr0gvXj7uFi9Zsl6/BPgJRMRHNBPbcLQwFMFjZEdb1ZYS3nW6AFDWy0UTuC3qvorXVfb7o04GNYYS53yIb3lFqQdXXMnk8EliYqB/uX0PZ4N0KQGvW92KlS/NsB4ZIbdFubb8SO2uvHC/BBM/i2m2GhXPe43GWFxl5GrP34lSy0QyvAqCUINY5q19FmRRmcjswRG4LlAL7ZIH5DtiHCNLIb1FuFPCNwNmHDakOiK0Ok+HHvbYHe8vHdlL1BBA//3f4sRievMwhviuybweFKKb+ehW2DY9f4qeDn4OKrU/4vch9mCLsYqfNpgm0OkqlVe7BgEvlcvCMZ1ha6PIJNX+jwwxWbsxWxLYuKPjEIYXlvbSPdy+WE4UITrIuUOm0sJDwJbDlGr5EJN/3ixQz+mfU77DbOUC16b7HxJQpJlDZ1el1KdWyceMFl6svl438CrLfJaS0NayiE9v3w1ygsAxsayU6g9l+Otrjl/EtLnputAOGmOYwDC1nRy/bqK2ZhQRRRXVdOFOhXbOmVUTsYzvKEC+cnYV97fJ42KeDLBIKwx1vcfiM5Lc+BRuB87MeI7JYwSvMtGuTY9OkYt0p5KvIzRF7+GGOJgy0D6YHmmmKhsQCPlJT3QWMBb1zuBSvHNlCbCalmb3a3g9TTKdHM7uReLNl6tjPntXL3G66Fexj9Se2cnvaFa6ZJqizKZ0PZZ0uVn8p2HZtLFutGt2hwlDdrXhFJ9uGVPl6fvWd/Iqs7KMrUkhovZz86nEkD2CbaPct5moKXXu+735xztBXDn5M3HI14+r3xWWPulag8lSd+tlHvnPBDnitzkFXHo8+NJ2zQtKZTtokDmzLCyk0KxRKVrUKtGtjBSlwQzjvalujiGXtle+/opELfkBj47cSxa3fL4iDNtTP5/b5J4TXNNTv/SeEyehhxrKGu3rI/xv6DdBrh+f2fkO/pPjfLPyMhkusmf9LGlvVzM/RL7+nYZxdflZj+s/0n+k/03+m/0z/mf4z/Wf6z/Sf6T/Tf6b/TP+Z/jP9Z/rP9J/pP9N/pv9M/5n+M/1n+s//E7MA'; this.srcset='data:image/jpg;base64,UklGRsYHAABXRUJQVlA4TLoHAAAvV8JjAAVd1drC2tb7v1sqK5s0FgGLEAgifxAJnOj3/RrXuueuC9eI/lOQJDluJAXmvjYqAUJUEdoHLD+rMf1n+s/0n+k/03+m/0z/mf4z/Wf6z/Sf6T/Tf6b/TP+Z/jP9Z/rP9J/pP9N/pv9M/5n+M/1n+s+PH+uPKCLbrwkT7mp8aXZRjvXBi5wjs4pEM9L0xyetklPEv+HcACqmMUM7Gtc9IqfI8THc2nE8pD8CbmDCU95AuCetWL5uPYvgDeeGF8MuxRzvZdhUSU0ebZF9Be7BkRGRUuElpNnt40gPp/sz7Jfm0rL99bOCyV+WL83iqrEXq7cadvm+rMXujnjD+cvg/pCWb0nfCfvCLKtzbkG84fyZNBYif3UMnOALxfyXjN2DiBwbxosEReOI9MPcKSKnNw/IXYPxhSCv6ixkY1GwqgNeVmGoK6Sh8bUeIhKPlddJUtxDEZqlFNqRaj+xpec2TEQ0rUBF7I7OmPFljcDXxKqQXLUwKxdHQ9xrzVJte+oPO33XCpPiwIltmp6BQf3m5NlidHyjgP0wE+uuz066QMlRjlwLHoikKJjMQrj1rk3YwmaV2lmcyrn0Bm53sAC99nqzUS4zdVBpozNmAqqx+sFOCwlV1cKXRHUtFkpbYlGpQhRLWQXNX9P0jMqecLStIKXzIrIBunvMKdDoMqTgrCi4msCsdW3GFUXfJAHqrFpP2RPtrNF2lEPBhm1PwoqVcrkpHRRp5XgIGv3KiggRyBxcpmV6BiWza7YTfIYD0VhrFFVdpqFJHOA0UNeOKIbXsXM5SNYZZYZTfGVeGbIy57wqN952iqH9cipKvhvmr2V6xuQJ0jvnvJS1dSQA2Vzs8M65cs8VRGFVNLPPIuvYo2BTCMoGyji6E5DybTU4RcWuWds450IRtLIrb4ug0u6c2wJb8yaDGveixqs0rQq5qkKa0UxfApcSDRHiUIpH+UyhaXoGxeMLK3cBX6uBXIXmgvEIuT5toeRaCsYSO7wpyqYb9R4CA4kaLlyxe5ZHatFu/GvY8ASFYM7iBZ4Eqvpr7ZDpMxfWT7iwnfD4JZLi2pLvmOwLueHxPSC2Qq40WzhBklnwBihNBaNL/ySuW1/QS1Ms8lA6eybrWrR7YNndwwoxxTMikm56BTp9Cel7FuJegKYvW5JiaJqeEUnQ44kqdCKz27BAdo0IcQsztO0FLwaXez7ldiXQheYhIBfhhz1atHuwF1s5TAqx12+E4Na1voVXTl+kthciMllTrJWWfEfkpItWOhH1eXimnnCZ+TFsKlg1ju4o+nacROVMlGhbtHsgNEKLiFUlRP4tDFRChfGoPCIDWbiOWvIdkY2q5U4cNF69esDER7ilYI5x+/ksv9gVQ6OKFFPLddNuhZ6d0107hpYWXuLiV9CuPKrmABbJInvfku+Q/ViuNgI3vgB5ci0F0z4/6it1ZaEIhCh30+6B4rZIyDYmcFxPJS8hnEN7FuMBbRC45ufaOlry/QdAuuCLs2oDIwOyqOFjSEQPH38BrPjBQ/oh4av2oxy7M8sxJOmzOT+a7Sshw3A2Y/NDAG2AL/nLDnMRHBvr0gvXj7uFi9Zsl6/BPgJRMRHNBPbcLQwFMFjZEdb1ZYS3nW6AFDWy0UTuC3qvorXVfb7o04GNYYS53yIb3lFqQdXXMnk8EliYqB/uX0PZ4N0KQGvW92KlS/NsB4ZIbdFubb8SO2uvHC/BBM/i2m2GhXPe43GWFxl5GrP34lSy0QyvAqCUINY5q19FmRRmcjswRG4LlAL7ZIH5DtiHCNLIb1FuFPCNwNmHDakOiK0Ok+HHvbYHe8vHdlL1BBA//3f4sRievMwhviuybweFKKb+ehW2DY9f4qeDn4OKrU/4vch9mCLsYqfNpgm0OkqlVe7BgEvlcvCMZ1ha6PIJNX+jwwxWbsxWxLYuKPjEIYXlvbSPdy+WE4UITrIuUOm0sJDwJbDlGr5EJN/3ixQz+mfU77DbOUC16b7HxJQpJlDZ1el1KdWyceMFl6svl438CrLfJaS0NayiE9v3w1ygsAxsayU6g9l+Otrjl/EtLnputAOGmOYwDC1nRy/bqK2ZhQRRRXVdOFOhXbOmVUTsYzvKEC+cnYV97fJ42KeDLBIKwx1vcfiM5Lc+BRuB87MeI7JYwSvMtGuTY9OkYt0p5KvIzRF7+GGOJgy0D6YHmmmKhsQCPlJT3QWMBb1zuBSvHNlCbCalmb3a3g9TTKdHM7uReLNl6tjPntXL3G66Fexj9Se2cnvaFa6ZJqizKZ0PZZ0uVn8p2HZtLFutGt2hwlDdrXhFJ9uGVPl6fvWd/Iqs7KMrUkhovZz86nEkD2CbaPct5moKXXu+735xztBXDn5M3HI14+r3xWWPulag8lSd+tlHvnPBDnitzkFXHo8+NJ2zQtKZTtokDmzLCyk0KxRKVrUKtGtjBSlwQzjvalujiGXtle+/opELfkBj47cSxa3fL4iDNtTP5/b5J4TXNNTv/SeEyehhxrKGu3rI/xv6DdBrh+f2fkO/pPjfLPyMhkusmf9LGlvVzM/RL7+nYZxdflZj+s/0n+k/03+m/0z/mf4z/Wf6z/Sf6T/Tf6b/TP+Z/jP9Z/rP9J/pP9N/pv9M/5n+M/1n+s//E7MA';" -->

            {#if highres === 'false'}
                <source
                    id="{filename}-sm-avif"
                    type="image/avif"
                    srcset="{BACKEND_URL}/media/{type}/{filename}-sm.avif"
                    media="(min-width: 576px)"
                    class="card-img-top"
                    alt={title}
                    {loading}
                    bind:this={avifSm}
                />
            {/if}
            <source
                id="{filename}-md-avif"
                type="image/avif"
                srcset="{BACKEND_URL}/media/{type}/{filename}-md.avif"
                media={highres ? '' : '(max-width: 575px)'}
                class="card-img-top"
                alt={title}
                {loading}
                bind:this={avifMd}
            />
            <img
                width="520"
                height="293"
                id="{filename}-jpg"
                srcset="{BACKEND_URL}/media/{type}/{filename}-sm.jpg 576w, {BACKEND_URL}/media/{type}/{filename}-md.jpg 575w"
                src="{BACKEND_URL}/media/{type}/{filename}-md.jpg"
                class="card-img-top"
                alt={title}
                {loading}
                bind:this={jpg}
            />
        </picture>
        <div class="timecode-overlay text-white">
            {toHHMMSS(duration, false)}
        </div>
        {#if watched[type][uuid]}
            <div id="watched-progress" data-id={uuid} class="progress progress-overlay">
                <div
                    class="progress-bar"
                    role="progressbar"
                    aria-label="{uuid}-progress"
                    aria-valuenow={watched[type][uuid]}
                    aria-valuemin="0"
                    aria-valuemax={duration}
                    style:width={`${Math.round((watched[type][uuid] * 100) / duration)}%`}
                />
            </div>
        {/if}
    </div>
</a>

<style lang="scss">
    .card-img-top {
        border-radius: 0.25rem;
        width: 100%;
        height: auto;
    }

    .progress-overlay {
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 0.4rem;
        border-radius: 0 0 0.25rem 0.25rem;
        background-color: var(--progress-bar-bg);

        .progress-bar {
            background-color: var(--progress-bar-fg);
        }
    }
    .timecode-overlay {
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 7px;
        background: black;
        padding: 0px 3px;
        border-radius: 0.25rem;
    }
</style>
