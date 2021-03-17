<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/111204692-b31d6900-85c6-11eb-8a24-99add8e0edb9.png">  
</p>
<p align="center">
    <i>Safely bundle server environment variable into react apps</i>
    <br>
    <br>
    <img src="https://github.com/garronej/react-envs/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/react-envs">
    <img src="https://img.shields.io/npm/dw/react-envs">
    <img src="https://img.shields.io/npm/l/react-envs">
</p>

# Motivation

Create react app provides no official way to inject environment variable from the server into the page.  
When you run `yarn build` create react app does bundle all the variables prefixed by `REACT_APP_`
and expose them under `process.env` ([see here](https://create-react-app.dev/docs/adding-custom-environment-variables/)).  
The problem, however, is that you likely don't want to build your app on the server.  
The CRA team also suggests to [introduce placeholders](https://create-react-app.dev/docs/title-and-meta-tags/#injecting-data-from-the-server-into-the-page) in the `public/index.html` 
and do the substitution on the server before serving the app. This solution involves a lot of hard to maintain scripting.

This module abstract away the burden of managing environment variable injection as well as providing a type-safe way
to retrieve them in your code.

# Step by step guide

Start by installing the tool: 

```bash
yarn add react-envs 
```

Then declare all the allowed environment variables into the `.env` file of your project

Example
```ini
REACT_APP_FOO="Default value of foo"
REACT_APP_BAR=
REACT_APP_BAZ=
REACT_APP_FIZZ=
```

Once it's done run the script `npx generate-env-getter` ( Use `npx generate-env-getter js` if you your project don't use TypeScript)

It will generate `src/env.ts` ( or `src/env.js`) looking like:
```typescript
/* 
 * Automatically generated by react-envs.
 * If you wish to declare a new environment variable add it in the .env file
 * then run 'npx generate-env-getter'. This file will be updated.
 */
import { getEnvVarName } from "react-envs";

export function getEnv() {
    return {
        "FOO": getEnvVarName("FOO"),
        "BAR": getEnvVarName("BAR"),
        "BAZ": getEnvVarName("BAZ"),
        "FIZZ": getEnvVarName("FIZZ")
    } as const;
}
```

Now let's test it by creating a `.env.local` file like:  
```ini
REACT_APP_BAR="Value of bar defined in .env.local"
```

And let's do this somewhere in our code: 

```typescript
import { getEnv } from "./path/to/env.ts"

console.log(getEnv());
```
Now if we run `REACT_APP_BAZ="Value of baz passed inline" yarn start` we get this
in the console: 

```json
{
    "FOO": "Default value of foo",
    "BAR": "Value of bar defined in .env.local",
    "BAZ": "Value of baz passed inline",
    "FIZZ": ""
}
```

Now if you run `yarn build` then `BAZ="Value of baz on the server" npx embed-environnement-variables`
the value of `BAZ` will be injected in `build/index.html` (or `html/index.html`) so that if you 
start statically serving
the `build/` dir, for example with `serve -s build` you will get this in the console:  

```json
{
    "FOO": "Default value of foo",
    "BAR": "Value of baz on the server",
    "BAZ": "",
    "FIZZ": ""
}
```

Note that on the server the environment variable names don't need to be prefixed with `REACT_APP_` (they can though).
Also note that the script runs very fast and thus represent virtually no overhead when starting your container.

The next step is to set up a clean Dockerfile where there is both node and ngnix available.  
node for being able to run `npx embed-environnement-variables` and Ngnix for serving the app.  
It is also important to make sure `react-envs` is not bootstraped by `npx in the entypoint`.

# Clean setup example

Find [**here**](https://github.com/garronej/react-envs-demo-app) a demo setup to help you integrate `react-envs`
in your app.

![image](https://user-images.githubusercontent.com/6702424/111223899-09e26d00-85de-11eb-84ea-566f9ed58eee.png)

![image](https://user-images.githubusercontent.com/6702424/111223405-685b1b80-85dd-11eb-977c-e8ea1eda1e29.png)

