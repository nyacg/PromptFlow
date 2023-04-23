# LMQL server

This is 🤢 but it's a hackathon 

We use Python to execute and parse the LMQL script in a little FastAPI server because that's easier than understanding 
the socket.io interface

Setup:
```bash
cd ./src/llm/server
python3.10 -m venv venv
. venv/bin/activate
pip install -r requirements.txt 
```

Run:
```bash
python main.py
```