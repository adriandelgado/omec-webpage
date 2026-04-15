<script lang="ts">
	interface Member {
		id: string;
		name: string;
		role: string;
		image: string;
		image_alt: string;
	}

	interface Props {
		members: readonly Member[];
		class?: string;
		grid_class?: string;
	}

	let {
		members,
		class: class_name = "",
		grid_class = "sm:grid-cols-2 lg:grid-cols-3",
	}: Props = $props();
</script>

<div class={["py-8", class_name]}>
	<div class={["grid gap-x-8 gap-y-10", grid_class]}>
		{#each members as member (member.id)}
			<article class="flex items-center gap-4 md:gap-5">
				<img
					src={member.image}
					alt={member.image_alt}
					class="h-24 w-24 shrink-0 rounded-full object-cover"
				/>

				<div class="min-w-0">
					<h3 class="text-3xl leading-none font-semibold tracking-tighter text-primary">
						{member.name}
					</h3>
					<p class="mt-2 text-lg leading-snug tracking-wider text-copy/72">
						{member.role}
					</p>
				</div>
			</article>
		{/each}
	</div>
</div>
