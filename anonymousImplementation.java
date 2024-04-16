
public class anonymousImplementation {

    //定义一个类sampleClass来继承（实现）接口Greeting
    public class sampleClass implements Greeting {
        public void sayHello() {
            System.out.println("Hello, friend!");
        }
    }
    //sampleInstance是实现了接口Greetingr的类sampleClass的实例化：
    sampleClass sampleInstance = new sampleClass();

    //定义一个接口Greeting(类型)的变量，将
    Greeting samplGreeting = sampleInstance;

    //下面这段接口的匿名实现类的代码，实际上是上面这些代码的简化写法，用于对只使用一次的类的简化的匿名写法
    public Greeting createGreeting() {
        // 创建一个Greeting接口的匿名实现类的实例
        Greeting greeting = new Greeting() {
            @Override
            public void sayHello() {
                System.out.println("Hello, friend!");
            }
        };
        return greeting;
    }

    public static void main(String[] args) {
        anonymousImplementation instance = new anonymousImplementation();

        // 使用这个匿名实现类的实例
        Greeting greeting = instance.createGreeting();
        greeting.sayHello();
    }
}