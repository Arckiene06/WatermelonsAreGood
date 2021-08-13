# Watermelons are Good 🍉
## top level await's selfbot
This is a selfbot I wrote in around 12 hours.

### How do I use doe?

Copy config.example.json over to `config.json` and edit your `token` part to your token. You can get it via running `localStorage.token` in your browser. After this, you have to send your token to Lapis, who will allow you to use bots on your account. After this, install NodeJS, run `npm install`, then run `node`. Enjoy :D

### You can make your own!

The `CommandManager` class is only used for the `commands`, which are only in bot.js and can be ignored if you want to create your own bot with my code. 
You can copy the ClientManager and MidiManager parts to a folder and creating your own bot.js will make them work. Those two classes are entirely self dependant.

### Todo

- Clean up ClientManager (change the 30 if statements to a switch)
- Space everything out right (everywhere is fucked)

### Code credits

- Aeiou, for encouraging me to use Maps instead of arrays and make everything a class, 
- a bunch of credits to the MPP Player Bot, it helped me fix a couple bugs with repeating, 
- Aeiou's protocol docs, saved me several times
- My cat (I petted it)
- Blobek for crying constantly
- My windows FUCKING UPDATING