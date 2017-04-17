import plotly.graph_objs as go
import plotly.offline as po
from plotly.graph_objs import *

def generate_bar_chart(input_list, chart_title):
    x_axis = []
    y_axis = []
    for item in input_list:
        x_axis.append(item[0])
        y_axis.append(item[1])
    data = [go.Bar(
                x = x_axis,
                y = y_axis
        )]

    layout = go.Layout(
        title = chart_title,
    )
    fig = go.Figure(data=data, layout=layout)
    po.iplot(fig, filename='basic-bar')
def generate_grouped_bar(input_list, chart_title):
    data = []
    for list_item in input_list:
        x_axis = []
        y_axis = []
        label = list_item[1]
        for item in list_item[0]:
            x_axis.append(item[0])
            y_axis.append(item[1])
        trace = go.Bar(
            x = x_axis,
            y = y_axis,
            name = label
        )
        data.append(trace)
    layout = go.Layout(
        title = chart_title,
        barmode='group'
    )
    fig = go.Figure(data=data, layout=layout)
    po.iplot(fig, filename='grouped-bar')