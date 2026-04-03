import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";

import Runtime "mo:core/Runtime";


actor {
  type Enrollment = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    timestamp : Time.Time;
  };

  type EnrollmentPublic = {
    id : Nat;
    name : Text;
    timestamp : Time.Time;
  };

  let enrollments = Map.empty<Nat, Enrollment>();
  var nextId = 0;

  let ADMIN_API_KEY = "super_secure_api_key"; // TODO: Store securely

  public shared ({ caller }) func submitEnrollment(name : Text, email : Text, phone : Text) : async Nat {
    if (name == "" or email == "" or phone == "") {
      Runtime.trap("All fields are required");
    };

    let enrollment : Enrollment = {
      id = nextId;
      name;
      email;
      phone;
      timestamp = Time.now();
    };

    enrollments.add(nextId, enrollment);
    nextId += 1;
    nextId - 1;
  };

  public query ({ caller }) func getEnrollment(id : Nat, apiKey : Text) : async Enrollment {
    if (apiKey != ADMIN_API_KEY) {
      Runtime.trap("Unauthorized");
    };

    switch (enrollments.get(id)) {
      case (null) { Runtime.trap("Enrollment not found") };
      case (?enrollment) { enrollment };
    };
  };

  public query ({ caller }) func getAllEnrollments(apiKey : Text) : async [Enrollment] {
    if (apiKey != ADMIN_API_KEY) {
      Runtime.trap("Unauthorized. ");
    };

    let values = enrollments.values();
    values.toArray();
  };

  public query ({ caller }) func getTotalEnrollments() : async Nat {
    enrollments.size();
  };

  public shared ({ caller }) func updateEnrollment(id : Nat, name : Text, email : Text, phone : Text, apiKey : Text) : async () {
    if (apiKey != ADMIN_API_KEY) {
      Runtime.trap("Unauthorized. ");
    };

    switch (enrollments.get(id)) {
      case (null) { Runtime.trap("Enrollment not found") };
      case (?enrollment) {
        let updatedEnrollment : Enrollment = {
          id;
          name;
          email;
          phone;
          timestamp = enrollment.timestamp;
        };
        enrollments.add(id, updatedEnrollment);
      };
    };
  };

  public shared ({ caller }) func deleteEnrollment(id : Nat, apiKey : Text) : async () {
    if (apiKey != ADMIN_API_KEY) {
      Runtime.trap("Unauthorized");
    };

    if (not enrollments.containsKey(id)) {
      Runtime.trap("Enrollment not found");
    };
    enrollments.remove(id);
  };

  public query ({ caller }) func getPublicEnrollments() : async [EnrollmentPublic] {
    enrollments.values().toArray().map(
      func(e) {
        {
          id = e.id;
          name = e.name;
          timestamp = e.timestamp;
        };
      }
    );
  };

  public shared ({ caller }) func adminDeleteAllEnrollments(apiKey : Text) : async () {
    if (apiKey != ADMIN_API_KEY) {
      Runtime.trap("Unauthorized");
    };
    enrollments.clear();
    nextId := 0;
  };
};
