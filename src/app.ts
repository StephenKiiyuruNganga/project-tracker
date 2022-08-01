// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management
type Listener = (items: Project[]) => void

class ProjectState {
  private listeners: Listener[] = []
  private projects: Project[] = []
  private static instance: ProjectState

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance
    }
    this.instance = new ProjectState()
    return this.instance
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn)
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    )

    this.projects.push(newProject)
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }
}

const projectState = ProjectState.getInstance()

// Validation
interface Validatable {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

function validate(validatableInput: Validatable) {
  let isValid = true

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max
  }

  return isValid
}

// autobind decorator
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    },
  }

  return adjustedDescriptor
}

// ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLElement
  assignedProjects: Project[]

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement
    this.hostElement = document.getElementById("app")! as HTMLDivElement
    this.assignedProjects = []

    const importedTemplateContent = document.importNode(
      this.templateElement.content,
      true
    )
    this.element = importedTemplateContent.firstElementChild as HTMLElement
    this.element.id = `${type}-projects`

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active
        }
        return project.status === ProjectStatus.Finished
      })

      this.assignedProjects = relevantProjects
      this.renderProjects()
    })

    this.attach()
    this.renderContent()
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement

    listEl.innerHTML = ""

    for (const project of this.assignedProjects) {
      const listItem = document.createElement("li")
      listItem.textContent = project.title
      listEl.appendChild(listItem)
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector("ul")!.id = listId
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS"
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element)
  }
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLFormElement
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement
    this.hostElement = document.getElementById("app")! as HTMLDivElement

    const importedTemplateContent = document.importNode(
      this.templateElement.content,
      true
    )
    this.element = importedTemplateContent.firstElementChild as HTMLFormElement
    this.element.id = "user-input"

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement

    this.configure()
    this.attach()
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element)
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value
    const description = this.descriptionInputElement.value
    const people = this.peopleInputElement.value

    const validatableTitle: Validatable = {
      value: title,
      required: true,
      minLength: 3,
    }
    const validatableDescription: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    }
    const validatablePeople: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 5,
    }

    if (
      !validate(validatableTitle) ||
      !validate(validatableDescription) ||
      !validate(validatablePeople)
    ) {
      alert("Invalid input")
      return
    } else {
      return [title, description, +people]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = ""
    this.descriptionInputElement.value = ""
    this.peopleInputElement.value = ""
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      // console.log(userInput)
      projectState.addProject(title, desc, people)
      this.clearInputs()
    }
  }

  private configure() {
    // manual binding:
    // this.element.addEventListener("submit", this.submitHandler.bind(this))

    this.element.addEventListener("submit", this.submitHandler)
  }
}

const projectForm = new ProjectInput()
const activeProjectsList = new ProjectList("active")
const finishedProjectsList = new ProjectList("finished")
