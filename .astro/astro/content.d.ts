declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"AI大模型最新进展盘点.md": {
	id: "AI大模型最新进展盘点.md";
  slug: "ai大模型最新进展盘点";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"Cloud-Mail基于Cloudflare的免费邮箱服务部署指南.md": {
	id: "Cloud-Mail基于Cloudflare的免费邮箱服务部署指南.md";
  slug: "cloud-mail基于cloudflare的免费邮箱服务部署指南";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"DeepSeek-Harness-完全指南.md": {
	id: "DeepSeek-Harness-完全指南.md";
  slug: "deepseek-harness-完全指南";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"GitHub-2026-05-第三周热门新项目Top10.md": {
	id: "GitHub-2026-05-第三周热门新项目Top10.md";
  slug: "github-2026-05-第三周热门新项目top10";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"GitHub-2026-05-第二周热门新项目Top10.md": {
	id: "GitHub-2026-05-第二周热门新项目Top10.md";
  slug: "github-2026-05-第二周热门新项目top10";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"GitHub-2026-06-第三周热门新项目Top10.md": {
	id: "GitHub-2026-06-第三周热门新项目Top10.md";
  slug: "github-2026-06-第三周热门新项目top10";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"Hexo博客性能优化实践.md": {
	id: "Hexo博客性能优化实践.md";
  slug: "hexo博客性能优化实践";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"Markdown完全使用指南.md": {
	id: "Markdown完全使用指南.md";
  slug: "markdown完全使用指南";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"Multipass入门指南.md": {
	id: "Multipass入门指南.md";
  slug: "multipass入门指南";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"OpenClaw全方位指南.md": {
	id: "OpenClaw全方位指南.md";
  slug: "openclaw全方位指南";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"Python装饰器从入门到精通.md": {
	id: "Python装饰器从入门到精通.md";
  slug: "python装饰器从入门到精通";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"RouterOS-v7入门到精通学习笔记.md": {
	id: "RouterOS-v7入门到精通学习笔记.md";
  slug: "routeros-v7入门到精通学习笔记";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"Ubuntu-26-04-LTS-Resolute-Raccoon全面解析.md": {
	id: "Ubuntu-26-04-LTS-Resolute-Raccoon全面解析.md";
  slug: "ubuntu-26-04-lts-resolute-raccoon全面解析";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"alistaliyun.md": {
	id: "alistaliyun.md";
  slug: "alistaliyun";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"aliyunikuai.md": {
	id: "aliyunikuai.md";
  slug: "aliyunikuai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"casaos.md": {
	id: "casaos.md";
  slug: "casaos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"exo-将多台设备组成AI推理集群的完整指南.md": {
	id: "exo-将多台设备组成AI推理集群的完整指南.md";
  slug: "exo-将多台设备组成ai推理集群的完整指南";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"githelp.md": {
	id: "githelp.md";
  slug: "githelp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"github-weekly-top10-2026-05-04.md": {
	id: "github-weekly-top10-2026-05-04.md";
  slug: "github-weekly-top10-2026-05-04";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"hexotwikoo.md": {
	id: "hexotwikoo.md";
  slug: "hexotwikoo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"internetcafe.md": {
	id: "internetcafe.md";
  slug: "internetcafe";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"jellyfin.md": {
	id: "jellyfin.md";
  slug: "jellyfin";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"linuxshell.md": {
	id: "linuxshell.md";
  slug: "linuxshell";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"macssh.md": {
	id: "macssh.md";
  slug: "macssh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"multipasshelp.md": {
	id: "multipasshelp.md";
  slug: "multipasshelp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pi-agent-guide.md": {
	id: "pi-agent-guide.md";
  slug: "pi-agent-guide";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pvesetupistoreos.md": {
	id: "pvesetupistoreos.md";
  slug: "pvesetupistoreos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"routeros.md": {
	id: "routeros.md";
  slug: "routeros";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"routeros7use.md": {
	id: "routeros7use.md";
  slug: "routeros7use";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"system.md": {
	id: "system.md";
  slug: "system";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"truenas.md": {
	id: "truenas.md";
  slug: "truenas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"typora-picgo-core.md": {
	id: "typora-picgo-core.md";
  slug: "typora-picgo-core";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"vpsikuai.md": {
	id: "vpsikuai.md";
  slug: "vpsikuai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"vpsros.md": {
	id: "vpsros.md";
  slug: "vpsros";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"welcome.md": {
	id: "welcome.md";
  slug: "welcome";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"xiaoyaalist.md": {
	id: "xiaoyaalist.md";
  slug: "xiaoyaalist";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"从零搭建Hexo博客并部署到GitHub-Pages完整记录.md": {
	id: "从零搭建Hexo博客并部署到GitHub-Pages完整记录.md";
  slug: "从零搭建hexo博客并部署到github-pages完整记录";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"千问3.6生成前后对比.md": {
	id: "千问3.6生成前后对比.md";
  slug: "千问36生成前后对比";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"屌丝网管第一章.md": {
	id: "屌丝网管第一章.md";
  slug: "屌丝网管第一章";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"我这一生01-童年与留级.md": {
	id: "我这一生01-童年与留级.md";
  slug: "我这一生01-童年与留级";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"我这一生02-私立学校.md": {
	id: "我这一生02-私立学校.md";
  slug: "我这一生02-私立学校";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"我这一生03-第一次去郑州.md": {
	id: "我这一生03-第一次去郑州.md";
  slug: "我这一生03-第一次去郑州";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"我这一生04-长桥镇一中.md": {
	id: "我这一生04-长桥镇一中.md";
  slug: "我这一生04-长桥镇一中";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"爱快iKuai软路由安装全指南.md": {
	id: "爱快iKuai软路由安装全指南.md";
  slug: "爱快ikuai软路由安装全指南";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"阿里云腾讯云安装爱快系统步骤.md": {
	id: "阿里云腾讯云安装爱快系统步骤.md";
  slug: "阿里云腾讯云安装爱快系统步骤";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
