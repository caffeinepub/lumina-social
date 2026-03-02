import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include prefabricated Mixins after imports
  include MixinStorage();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type definitions
  public type Notification = {
    id : Text;
    notificationType : NotificationType;
    userId : Principal;
    notifiedBy : Principal;
    timestamp : Time.Time;
    isRead : Bool;
    metadata : ?Text;
  };

  public type NotificationType = {
    #like;
    #comment;
    #follow;
    #mention;
    #message;
  };

  public type Post = {
    id : Text;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    isPublic : Bool;
    hasStory : Bool;
  };

  public type UserProfile = {
    username : Text;
    displayName : Text;
    bio : Text;
    avatarUrl : Text;
    websiteUrl : Text;
    gender : ?Gender;
    isPrivate : Bool;
  };

  public type Gender = {
    #male;
    #female;
    #other;
  };

  // Storage
  let notifications = Map.empty<Text, Notification>();
  let posts = Map.empty<Text, Post>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    // Check if target user exists
    let targetProfile = switch (userProfiles.get(user)) {
      case (null) { return null };
      case (?profile) { profile };
    };

    // If profile is private and caller is not the owner or admin, deny access
    if (targetProfile.isPrivate and caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view private profile");
    };

    ?targetProfile;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Post management
  public shared ({ caller }) func createPost(content : Text, isPublic : Bool) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    // Verify user has a profile
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?_) {};
    };

    let postId = "p" # Time.now().toText();
    let newPost : Post = {
      id = postId;
      author = caller;
      content;
      timestamp = Time.now();
      isPublic;
      hasStory = false;
    };
    posts.add(postId, newPost);
    postId;
  };

  // Notification management
  public shared ({ caller }) func addNotification(postId : Text, notificationType : NotificationType) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add notifications");
    };

    // Check if post exists
    let post = switch (posts.get(postId)) {
      case (null) {
        Runtime.trap("Post does not exist");
      };
      case (?post) { post };
    };

    // Verify caller has permission to interact with this post
    // Users can only create notifications for public posts or their own posts
    if (not post.isPublic and post.author != caller) {
      Runtime.trap("Unauthorized: Cannot interact with private post");
    };

    let notificationId = "n" # Time.now().toText();
    let notification : Notification = {
      id = notificationId;
      notificationType;
      userId = post.author;
      notifiedBy = caller;
      timestamp = Time.now();
      isRead = false;
      metadata = ?"";
    };

    notifications.add(notificationId, notification);
    notificationId;
  };

  public query ({ caller }) func fetchNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch notifications");
    };

    // Only return notifications for the caller
    let userNotifications = List.empty<Notification>();
    for ((_, notification) in notifications.entries()) {
      if (notification.userId == caller) {
        userNotifications.add(notification);
      };
    };
    userNotifications.toArray();
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    let notification = switch (notifications.get(notificationId)) {
      case (null) {
        Runtime.trap("Notification does not exist");
      };
      case (?notification) { notification };
    };

    // Verify ownership - only the notification recipient can mark it as read
    if (notification.userId != caller) {
      Runtime.trap("Unauthorized: Can only mark your own notifications as read");
    };

    let updatedNotification : Notification = {
      id = notification.id;
      notificationType = notification.notificationType;
      userId = notification.userId;
      notifiedBy = notification.notifiedBy;
      timestamp = notification.timestamp;
      isRead = true;
      metadata = notification.metadata;
    };

    notifications.add(notificationId, updatedNotification);
  };

  // Story/Post viewing
  public query ({ caller }) func publicStories() : async [Post] {
    // No authentication required - public stories are visible to everyone including guests
    let publicPosts = List.empty<Post>();
    for ((_, post) in posts.entries()) {
      if (post.isPublic and post.hasStory) {
        publicPosts.add(post);
      };
    };
    publicPosts.toArray();
  };

  public query ({ caller }) func getPublicStoriesForUser(userId : Principal) : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view user stories");
    };

    // Check if user profile exists
    let userProfile = switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { profile };
    };

    // If profile is private and caller is not the owner or admin, deny access
    if (userProfile.isPrivate and caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view stories from private profile");
    };

    let publicPosts = List.empty<Post>();
    for ((_, post) in posts.entries()) {
      if (post.author == userId and post.isPublic and post.hasStory) {
        publicPosts.add(post);
      };
    };
    publicPosts.toArray();
  };

  // Admin functions for content moderation
  public query ({ caller }) func getAllPosts() : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all posts");
    };
    posts.values().toArray();
  };

  public shared ({ caller }) func deletePost(postId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete posts");
    };

    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?post) { post };
    };

    // Only post owner or admin can delete
    if (post.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own posts");
    };

    posts.remove(postId);
  };

  public query ({ caller }) func getAllNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all notifications");
    };
    notifications.values().toArray();
  };

  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };
    userProfiles.entries().toArray();
  };
};
