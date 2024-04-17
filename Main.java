// 这是一个接口，任何实现这个接口的类都需要实现setText方法
interface TextChanger {
    void setText(String text);
}

// 这是一个回调函数接口，当文本框的文本改变时，这个函数会被触发
interface TextChangedCallback {
    void onTextChanged(String newText);
}

// TextBox类实现了TextChanger接口
class TextBox implements TextChanger {
    @SuppressWarnings("unused")
    private String text;
    private TextChangedCallback callback;  // TextChangedCallback是一个回调函数接口

    // TextBox的构造函数
    public TextBox(String text, TextChangedCallback callback) {
        this.text = "";
        this.text = text;
        this.callback = callback;
    }

    // 实现TextChanger接口的setText方法
    public void setText(String text) {
        this.text = text;
        callback.onTextChanged(text);  // 当文本改变时，触发回调函数
    }
}

// 这是一个按钮类，可以修改文本框的文本
class Button {
    private TextChanger textChanger;

    // Button的构造函数
    public Button(TextChanger textChanger) {
        this.textChanger = textChanger;
    }

    // 这个方法会修改文本框的文本
    public void click() {
        textChanger.setText("Button was clicked");
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建一个TextBox实例，当其文本改变时，打印出新的文本
        //这里是一种叫做匿名实现类的写法，从字面上看就像是实例化了一个接口，它的作用就是针对于只被使用一次的的类的一种简化写法
        //匿名实现类的解释看anonymousImplementation.java
        TextChangedCallback callback = new TextChangedCallback() {
            @Override
            public void onTextChanged(String newText) {
                System.out.println("Text changed to: " + newText);
            }
        };
        TextBox textBox = new TextBox("", callback);

        // 创建一个Button实例，当其被点击时，修改TextBox的文本
        Button button = new Button(textBox);
        button.click();
    }
}