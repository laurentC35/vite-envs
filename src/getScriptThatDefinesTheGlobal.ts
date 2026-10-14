export function getScriptThatDefinesTheGlobal(): string {
    const scriptPropertyKey = "data-script-description";
    const scriptPropertyValue = "Environment variables injected by vite-envs";

    return `<script ${scriptPropertyKey}="${scriptPropertyValue}" src="./swEnv.js"></script>`;
}
