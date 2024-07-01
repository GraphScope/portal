import gradio as gr
import gsp

with gr.Blocks() as demo:
    modeling_html = gsp.get_html("modeling")
    gr.HTML(modeling_html)

app = demo.launch()
