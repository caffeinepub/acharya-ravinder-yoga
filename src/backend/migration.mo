import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  type OldSubmission = {
    fullName : Text;
    email : Text;
    companyName : Text;
    website : Text;
    monthlyAdSpend : Nat;
    biggestChallenge : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type OldActor = {
    submissions : List.List<OldSubmission>;
  };

  type NewEnrollment = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    timestamp : Time.Time;
  };

  type NewActor = {
    enrollments : Map.Map<Nat, NewEnrollment>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newEnrollment : NewEnrollment = {
      id = 0;
      name = "Legacy Submission";
      email = "unknown@example.com";
      phone = "unknown";
      timestamp = Time.now();
    };

    let enrollments = Map.fromIter<Nat, NewEnrollment>([(0, newEnrollment)].values());
    { enrollments; nextId = 1 };
  };
};
