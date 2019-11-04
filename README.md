# TalkControl

## Naming match with WebRemoteControlSpeaker

-   **ensuite-node => server**

    The server handling states, the source of truth

-   **ensuite-front => talk-control-master**

    The webpage to take control of the presentation

-   **ensuite-client => talk-control-slave**

    The script to include into the presentation to interact with talk-control-master

-   **layouts => layouts**

    The layouts: on stage (what the public see), presenter (what the presenter see)

-   **engines => engines**

    The engines to interact with revealjs, etc...

## The folders structure

-   **src**

    -   **client**

        -   **components**

            Contains components (WebComponents) to compose layouts

        -   **engines**

            Contains a folder for each engine (revealjs, ...) to be able to get data like: slide number, slide position, etc...

        -   **layouts**

            Handle several layouts for different purposes : on-stage layout, presenter layout, etc... Each layout is a set of components (see above)

        -   **talk-control-master**

            Handle the logic to take control of the slide show (interaction with iframe and more...)

        -   **talk-control-slave**

            Handle the logic to receive and send back events to talk-control-master

    -   **common**

        -   **event-bus**

            Event handling, client side and server side

            -   **postmessage**

                Send and receive messages between window and iframe

            -   **websockets**

                Send and receive messages through websockets (socket.io)

        -   **helpers**

            Useful things

    -   **server**

        The source of truth

-   **test**

    Unit tests
