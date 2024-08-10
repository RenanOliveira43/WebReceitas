from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

recipes = []

@app.route('/')
def index():
    return render_template('index.html', recipes=recipes)

@app.route('/add', methods=['GET', 'POST'])
def add_recipe():
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description'].replace('\n', '<br>')
        recipes.append({'id': len(recipes) + 1, 'title': title, 'description': description})
        return redirect(url_for('index'))
    return render_template('add_recipe.html')


@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_recipe(id):
    recipe = next((r for r in recipes if r['id'] == id), None)
    if request.method == 'POST':
        recipe['title'] = request.form['title']
        recipe['description'] = request.form['description'].replace('\n', '<br>')
        return redirect(url_for('index'))
    return render_template('edit_recipe.html', recipe=recipe)

@app.route('/delete/<int:id>')
def delete_recipe(id):
    global recipes
    recipes = [r for r in recipes if r['id'] != id]
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
