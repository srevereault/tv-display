breizhcamp-rooms
================

~/.config/lxsession/Lubuntu/autostart
 ```
 rm -fr /home/odroid/.config/pulse/client.conf
/usr/bin/gnome-settings-daemon

#@xscreensaver -no-splash
#@lxpanel --profile LXDE
#@pcmanfm --desktop --profile LXDE
#@/usr/lib/policykit-1-gnome/polkit-gnome-authentication-agent-1

@xset s off
@xset -dpms
@xset s noblank
@unclutter -idle 0.1 -root
@sed -i 's/\"exit_type\":\"Crashed\"/\"exit_type\":\"Normal\"/' ~/.config/chromium/Default/Preferences
@sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/Default/Preferences
#@chromium-browser --kiosk --disable-session-crashed-bubble --disable-breakpad --noerrdialogs http://vote-server:3000/ file:////home/odroid/applis/breizhcamp-rooms/index.html http://vote-server:3000/tweetwall.html
@chromium-browser --kiosk --disable-session-crashed-bubble --disable-breakpad --noerrdialogs --allow-file-access-from-files file:////home/odroid/applis/breizhcamp-rooms-new/index.html

 ```
