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

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    console.log("from title input ====>", this.titleInputElement.value)
  }

  private configure() {
    // manual binding:
    // this.element.addEventListener("submit", this.submitHandler.bind(this))

    this.element.addEventListener("submit", this.submitHandler)
  }
}

const projectForm = new ProjectInput()
