import gradio as gr
import gs_visual_tool 

with gr.Blocks() as demo:
    modeling_html = gs_visual_tool.get_html("querying")
    gr.HTML(modeling_html)

app = demo.launch()
