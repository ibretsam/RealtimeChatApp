# To be improved

> This document outlines the prioritization and grouping of tasks for
> future improvements to our chat application. The tasks have been
> categorized based on their impact on user experience, feasibility, and
> dependencies.

**Group 1: Basic User Experience Improvements**
> These tasks aim to enhance the fundamental user experience of the
> application:

 - [ ] Error Handling: Implement error messages for various scenarios:
	
	 - [ ] Login and registration: Display an error message when incorrect
       credentials are entered.
	 - [ ] Internet connection: Notify the user when there is no internet
       connection.
	 - [ ] Websocket status: Inform the user when the websocket is
       disconnected.
 - [ ] Loading Indicators: Introduce loading spinners for data-heavy
       screens:
	 - [x] Request Screen
	 - [ ] Messages Screen
	 - [ ] Profile Screen

- [ ] Layout Modification: Transition to a tab-based layout with Contacts, Messages, and Profile tabs. The Request page should be accessible from the Contacts screen.

**Group 2: Message Functionality Improvements**

> These tasks focus on enhancing the messaging functionality of the
> application:

- [ ] Message Status: Introduce read/unread status for messages and delivery/read receipts.

- [ ] Push Notifications: Implement push notifications for new messages.

- [ ] Media Messages: Enable sending of images, videos, and files.

- [ ] Voice Messages: Allow sending of voice messages.

- [ ] Group Chat: Introduce a group chat feature.

**Group 3: User Profile Improvements**

> These tasks are centered around improving user profile management:

- [ ] Profile Picture: Allow users to change their profile picture and edit it before saving.

- [x] CDN Integration: Migrate all media files to a Content Delivery Network (CDN).

- [ ] Profile Updates: Enable users to update their password, email, username, and name.

**Group 4: Advanced User Experience Improvements**

> These tasks aim to introduce advanced features for a more personalized
> user experience:

- [ ] User Management: Implement features to block users, delete messages, mute notifications, and delete user accounts.

- [ ] User Status: Display online status and last seen time for users.