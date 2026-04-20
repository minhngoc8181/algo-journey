import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'notification-observer',
  version: 1,
  title: 'Notification System - Observer Pattern',
  summary: 'Implement a publish-subscribe notification system using the Observer pattern.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'observer-pattern', 'events', 'cse202'],
  estimatedMinutes: 20,
  order: 453,
  mode: 'class_implementation',
  hints: [
    'Define an interface `Observer` with the method `String update(String message)`.',
    'Concrete observers (`EmailNotifier`, `SmsNotifier`, `AppNotifier`) should store their target address in their constructor.',
    '`NotificationService` should maintain a list of registered observers: `List<Observer>`.',
    'When `sendNotification` is called, loop through the list, call `update` on each observer, collect the returned strings, and join them.'
  ],

  learningGoals: [
    'Understand and implement the Observer Design Pattern',
    'Achieve loose coupling between the publisher (Service) and subscribers (Observers)',
    'Manage dynamic lists of interface implementations'
  ],
  statement: `You are building a notification system where a central service broadcasts messages to various registered channels (observers). 

Implement the **Observer Pattern** with the following:

**Interface:**
- \`Observer\` — declares a single method \`String update(String message)\`.

**Concrete Observers (each implements \`Observer\`):**
- \`EmailNotifier(String email)\` — \`update(message)\` returns \`"Email to {email}: {message}"\`
- \`SmsNotifier(String phone)\` — \`update(message)\` returns \`"SMS to {phone}: {message}"\`
- \`AppNotifier(String username)\` — \`update(message)\` returns \`"App notification to {username}: {message}"\`

**Context class:**
- \`NotificationService()\` — Creates an empty notification service.
- \`void addObserver(Observer observer)\` — Registers a new observer.
- \`void removeObserver(Observer observer)\` — Removes a registered observer. (Using Java's default object reference equality is fine).
- \`String sendNotification(String message)\` — Broadcasts the message to all current observers in the order they were added. It must return a formatted array string of all their responses (e.g., \`"[Email to a@a.com: Hello, SMS to 123: Hello]"\`). If there are no observers, return \`"[]"\`.`,
  constraints: [
    'Message length is between 1 and 100 characters.',
    'At most \`1000\` calls will be made in total.',
    'A removed observer will no longer receive messages.'
  ],
  examples: [
    {
      input: `NotificationService service = new NotificationService();
EmailNotifier email = new EmailNotifier("john@example.com");
SmsNotifier sms = new SmsNotifier("555-0100");

service.addObserver(email);
service.sendNotification("System reboot"); 
// return "[Email to john@example.com: System reboot]"

service.addObserver(sms);
service.sendNotification("Update ready");  
// return "[Email to john@example.com: Update ready, SMS to 555-0100: Update ready]"

service.removeObserver(email);
service.sendNotification("Done");          
// return "[SMS to 555-0100: Done]"`,
      output: '[null, null, null, null, "[Email to john@example.com: System reboot]", null, "[Email to john@example.com: Update ready, SMS to 555-0100: Update ready]", null, "[SMS to 555-0100: Done]"]'
    }
  ],

  starter: {
    file: 'NotificationService.java',
    code: `import java.util.ArrayList;
import java.util.List;

interface Observer {
    String update(String message);
}

class EmailNotifier {
}

class SmsNotifier {
}

class AppNotifier {
}

class NotificationService {

    public NotificationService() {
        
    }
    
    public void addObserver(Observer observer) {
        
    }
    
    public void removeObserver(Observer observer) {
        
    }
    
    public String sendNotification(String message) {
        return "[]";
    }
}`,
  },

  requiredStructure: {
    className: 'NotificationService',
    requiredMethods: [
      'NotificationService()',
      'void addObserver(Observer observer)',
      'void removeObserver(Observer observer)',
      'String sendNotification(String message)'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 55443322,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 30 : 300;
            NotificationService obj = new NotificationService();

            // Reference state
            java.util.List<Observer> refObservers = new java.util.ArrayList<>();
            java.util.List<Observer> availableObjects = new java.util.ArrayList<>();

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(4);

                if (type == 0) { // add random new observer
                    int obsType = rng.nextInt(3);
                    Observer obs;
                    if (obsType == 0) obs = new EmailNotifier("user" + k + "@mail.com");
                    else if (obsType == 1) obs = new SmsNotifier("1234" + k);
                    else obs = new AppNotifier("appUser" + k);
                    
                    availableObjects.add(obs);
                    refObservers.add(obs);
                    obj.addObserver(obs);
                } else if (type == 1 && !availableObjects.isEmpty()) { // add existing observer again
                    Observer obs = availableObjects.get(rng.nextInt(availableObjects.size()));
                    refObservers.add(obs);
                    obj.addObserver(obs);
                } else if (type == 2 && !refObservers.isEmpty()) { // remove observer
                    Observer obs = refObservers.get(rng.nextInt(refObservers.size()));
                    refObservers.remove(obs);
                    obj.removeObserver(obs);
                } else { // sendNotification
                    String msg = "msg_" + rng.nextInt(1000);
                    
                    java.util.List<String> results = new java.util.ArrayList<>();
                    for (Observer o : refObservers) {
                        results.add(o.update(msg));
                    }
                    String expectedAns = "[" + String.join(", ", results) + "]";
                    String actualAns = obj.sendNotification(msg);

                    expTrace.add(expectedAns);
                    actTrace.add(actualAns);
                }
                if (expTrace.size() == traceSizeBefore) {
                    expTrace.add(null);
                    actTrace.add(null);
                }
            }
            boolean pass = actTrace.equals(expTrace);
            String actStr = actTrace.toString();
            String expStr = expTrace.toString();
            if (!pass) {
                int mismatchIdx = -1;
                for (int m = 0; m < actTrace.size(); m++) {
                    if (actTrace.get(m) == null && expTrace.get(m) == null) continue;
                    if (actTrace.get(m) == null || !actTrace.get(m).equals(expTrace.get(m))) { mismatchIdx = m; break; }
                }
                if (actStr.length() > 2000) actStr = actStr.substring(0, 2000) + "...";
                if (expStr.length() > 2000) expStr = expStr.substring(0, 2000) + "...";
                if (mismatchIdx != -1) {
                    actStr = "[Mismatch at idx " + mismatchIdx + "] " + actStr;
                    expStr = "[Mismatch at idx " + mismatchIdx + "] " + expStr;
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + actStr + "|" + expStr);
        }`
    }
  }
});
