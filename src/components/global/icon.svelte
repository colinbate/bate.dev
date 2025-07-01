<script lang="ts">
    import { twMerge } from "tailwind-merge";

    type IconProps = {
        icon: string;
        class?: string;
    };
    let { icon, class: className }: IconProps = $props();

    let href = $derived(`/icons.svg?3.4#${icon}`);
</script>

{#if icon}
    <svg
        preserveAspectRatio="xMidYMid meet"
        class={twMerge(`m-0 mt-0! inline-block size-4`, className)}
        ><use xlink:href={href} {href} /></svg
    >
{/if}
