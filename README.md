# Java Trail

Java Trail is a small, free learning product for Java fundamentals. It turns the original hello-world and type-casting snippets into six focused lessons with clear examples, quick knowledge checks, and a primitive numeric conversion sandbox.

## Learning features

- Six guided modules covering a first program, variables, numeric conversions, control flow, methods, and collections.
- Short Java examples with one-question practice checks.
- Progress saved locally in the current browser. No account or server is used.
- Conversion sandbox for Java's numeric primitive casts, including narrowing and signed integer wraparound.
- Keyboard accessible controls, responsive layout, and reduced-motion support.

The sandbox models selected numeric conversions for learning. It is not a Java compiler and does not execute arbitrary code. The Java examples are also kept in `examples/java/com/dp/training` for learners with a JDK.

## Run the learning app

Serve this folder with any static web server and open its local URL. For example, with Python installed:

```bash
python -m http.server 4173
```

Then visit `http://localhost:4173`. The app has no build step, package install, API key, database, or paid service requirement.

Compile and run the standalone Java examples with a JDK:

```bash
javac -d out examples/java/com/dp/training/*.java
java -cp out com.dp.training.Demo
java -cp out com.dp.training.Typecasting
```

## Stack

- Semantic HTML, modern CSS, and native JavaScript modules.
- Browser `localStorage` for local learning progress.
- No third-party runtime dependencies.
