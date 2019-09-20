# countdown
A react native countdown application
* To debug on Android
  * Create an app on the Google API console: console.developers.google.com
  * Create `secrets.json` with this content:
    ```
    {
      "androidClientIdExpo": "<your-client-id-for-expo>",
      "androidClientIdAndroid": "<your-client-id-for-android>"
    }
    ```
  * Install expo
    ```
    npm install -g expo-cli
    ```
  * If behind the windows firewall, open up ports for expo
    * Create inbound and outbound rules for TCP ports 19000-19003
  * Install Android Studio
  * Install Intel Emulator Excellerator
    * Ensure it is installed with the SDK manager in Android Studio
    * Open C:\users\%USERNAME%\AppData\Local\Android\sdk\extras\intel\Hardware_Accelerated_Execution_Manager\ and run the file named intelhaxm-android.exe
  * Install emulator using the AVD manager
  * Start the emulator
  * Install node dependencies
    ```
    npm install
    ```
  * Run the npm script to debug on the device
    ```
    npm run android
    ```
  * In the simulator, enter `Ctrl+m`, and select `Debug JS Session Remotely`
  * A browser tab will open that you can open developer tools on to debug the JS
    * If there is an error about CORS, replace `localhost` in the browser with the IP address in the error, such as `192.168.86.37`