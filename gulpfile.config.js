const root = __dirname;
const config = {
    root: root,
    /**
     * The config files
     */
    systemconfig: `${root}/system.config.js`,
    tsconfig: `${root}/tsconfig.json`,

    /**
     * Other params
     */
    indexHTML: `src/index.html`,
    templatesModuleName: 'templates',
    build: ['compile', 'copy'],
    port: 3000,


    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks.
     */
    src: {
        basePath: `${root}/src/`,
        baseFiles: [`${root}/src/*.{ico,png,txt,md}`, `${root}/src/!(index).html`],
        watchFiles: `${root}/src/**/*.{css,ts,html,jpg,png}`,
        typescripts: [`${root}/src/**/!(*.spec).ts`,`${root}/typings/tsd.d.ts`, `!${root}/src/modules/server/class/ServerAPI.ts`],
        images: `${root}/src/images/**/*`,
        fonts: `${root}/src/fonts/**/*`,
        data: `${root}/src/data/**/*`,
        styles: [`${root}/src/styles/index.scss`],
        templates: [`${root}/src/modules/**/*.html`]
    },

    /**
     * The 'dist' folder is where our app resides once it's
     * completely built.
     */
    dist: {
        basePath: `${root}/dist/`,
        scripts: `${root}/dist/scripts/`,
        styles: `${root}/dist/styles/`,
        images: `${root}/dist/images/`,
        data: `${root}/dist/data/`,
        fonts: `${root}/dist/fonts/`
    }
};

export default config;
