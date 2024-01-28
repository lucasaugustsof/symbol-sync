## What is Symbol Sync?

Symbol Sync is a powerful tool for devs and designers working with Figma and React. This tool streamlines the synchronization of icons from Figma to React projects, enabling quick conversion of Figma icon designs into reusable React components. Beyond speeding up the design-to-code workflow, Symbol Sync boasts a crucial feature: it generates an icon library ready to be published on npm. This means that in a matter of seconds or minutes — depending on your internet connection — you can have an updated, consistent icon library, ready for integration and distribution via npm. It's the ideal solution for keeping your project's UI in sync with the latest designs, saving valuable time and ensuring alignment between designed and implemented visuals.

## How to use?

1. You will need an access token from Figma. To obtain this token, please follow the detailed steps provided in the official Figma [documentation](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens).
2. Once you have the token, create an environment variable named `FIGMA_ACCESS_TOKEN` in the `.env` file of your project, and assign the obtained token to this variable.
3. At the root of your project, create a `JSON` configuration file named `symbol-sync.json`. This file will be used to define specific settings necessary for synchronizing icons.
4. Now, configure your `symbol-sync.json` file with the following properties:
    ```json
    {
        "fileId": "<Figma file ID>",
        "categories": [
            "category1",
            "category2"
        ],
        "entryDir": "<path to icon source>",
        "outDir": "<output directory for the library>"
    }
    ```
    - **fileId**: Enter the ID of the Figma file from which icons will be synchronized.
    - **categories**: List the categories of icons you wish to synchronize.
    - **entryDir**: Specify the directory where the original icons are located in your project.
    - **outDir**: Define the directory where the generated icon library will be saved."

    To obtain the Figma file ID, access the file's URL in your browser. The ID is the string of characters located after '/file/' in the URL. For example, in the URL 'https://www.figma.com/file/YOUR_FILE_ID/Symbol-Sync?type=design&node-id=92%3A2&mode=design&t=eTB5w36Qet43QQik-1', the file ID is `YOUR_FILE_ID`.
5. To ensure the application correctly reads the content, it is essential to create a page in Figma named `Symbol Sync`. This step is crucial as the application specifically looks for a page with this name to synchronize the icons.
    imagem-aqui
6. Continuing in Figma, it's essential to create a FRAME that will serve as a container for icons of a specific category. Name this FRAME according to the icon category it will represent. This step is crucial for the correct functioning of the application. Once the FRAME is established, you can begin filling it with the icons that belong to that specific category.
    video-aqui
7. Now, before creating your icons, ensure that the names are formatted correctly, following the example `alert-circle`, and that the color is set to `#000` (black). These details are essential to ensure proper functionality.
8. Now you can run the following command in your project to generate the icon components:
    ```zsh
    npx symbol-sync@latest run
    ```
    If you wish to create your library, you can add the `--build` flag.
9. Once you've run the command, you'll notice that React icon components have been generated in the directory specified in the configuration file, as well as your library in the directory also specified in the configuration file.
10. Now it's time to implement your brand new icon library into your project 🚀!

## Possible updates

Potential improvements to the Symbol Sync project:
- Support for React Native
- Generate an automatic CHANGELOG for the icons generated for your library

Made by [lucasaugustsof](https://lucasaugusts.com)
