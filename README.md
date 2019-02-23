# countdown
A react native countdown application
* To debug on Android
  * Install expo
    ```
    npm install -g expo-cli
    ```
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
