import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type required by the frontend
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Asset = {
    id : Text;
    name : Text;
    content : Text;
    assetType : Text;
  };

  module Asset {
    public func compare(a : Asset, b : Asset) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  let assets = Map.empty<Text, Asset>();

  type CreativePackage = {
    id : Text;
    productName : Text;
    description : Text;
    funnelStage : Text;
    tone : Text;
    scripts : [Asset];
    adCopy : [Asset];
    personas : [Asset];
    shots : [Asset];
  };

  module CreativePackage {
    public func compare(a : CreativePackage, b : CreativePackage) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  let creativePackages = Map.empty<Text, CreativePackage>();

  public shared ({ caller }) func saveAsset(id : Text, name : Text, content : Text, assetType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save assets");
    };
    let asset : Asset = {
      id;
      name;
      content;
      assetType;
    };
    assets.add(id, asset);
  };

  public query ({ caller }) func getAsset(id : Text) : async Asset {
    switch (assets.get(id)) {
      case (null) { Runtime.trap("Asset not found") };
      case (?asset) { asset };
    };
  };

  public shared ({ caller }) func saveCreativePackage(
    id : Text,
    productName : Text,
    description : Text,
    funnelStage : Text,
    tone : Text,
    scriptAssets : [Asset],
    copyAssets : [Asset],
    personaAssets : [Asset],
    shotAssets : [Asset],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save creative packages");
    };
    let creativePackage : CreativePackage = {
      id;
      productName;
      description;
      funnelStage;
      tone;
      scripts = scriptAssets;
      adCopy = copyAssets;
      personas = personaAssets;
      shots = shotAssets;
    };
    creativePackages.add(id, creativePackage);
  };

  public query ({ caller }) func getCreativePackage(id : Text) : async CreativePackage {
    switch (creativePackages.get(id)) {
      case (null) { Runtime.trap("Creative package not found") };
      case (?creativePackage) { creativePackage };
    };
  };

  public query ({ caller }) func getAllAssets() : async [Asset] {
    assets.values().toArray().sort();
  };

  public query ({ caller }) func getAllCreativePackages() : async [CreativePackage] {
    creativePackages.values().toArray().sort();
  };

  public query ({ caller }) func filterAssetsByType(assetType : Text) : async [Asset] {
    let filtered = List.empty<Asset>();
    for (asset in assets.values()) {
      if (Text.equal(asset.assetType, assetType)) {
        filtered.add(asset);
      };
    };
    filtered.toArray();
  };
};
