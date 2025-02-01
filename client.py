from flask import Flask, render_template

# Allows running the built React app from Flask
app = Flask(__name__, static_url_path="",
                      static_folder="react-client/dist",
                      template_folder="react-client/dist")

@app.route("/")
def react_client():
    return render_template("index.html")

# Start development web server
if __name__ == '__main__':
    app.run(port=5005, debug=True)