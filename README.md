# TalkControl

## About the folders structure

-   **src**

    -   **client**

        -   **components**

            Contains components (WebComponents) to compose layouts

        -   **engines**

            Contains a folder for each engine (revealjs, ...) to be able to get data like: slide number, slide position, etc...

        -   **layouts**

            Handle several layouts for different purposes : on-stage layout, presenter layout, etc... Each layout is a set of components (see above)

        -   **remote-control**

            Handle the logic to take control of the slide show (interaction with iframe and more...)

    -   **common**

        -   **event-bus**

            Event handling, client side and server side

            -   **postmessage**

                Fire and receive message between window and iframe

            -   **websockets**

                Fire and receive message through websockets (socket.io)

        -   **helpers**

            Useful things

    -   **server**

        The source of truth

-   **test**

    Unit tests
