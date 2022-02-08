import { element, by, ElementFinder } from 'protractor';

export class PlayerComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-player-my-suffix div table .btn-danger'));
  title = element.all(by.css('jhi-player-my-suffix div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class PlayerUpdatePage {
  pageTitle = element(by.id('jhi-player-my-suffix-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  dateOfBirthInput = element(by.id('field_dateOfBirth'));

  actualTeamSelect = element(by.id('field_actualTeam'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setDateOfBirthInput(dateOfBirth: string): Promise<void> {
    await this.dateOfBirthInput.sendKeys(dateOfBirth);
  }

  async getDateOfBirthInput(): Promise<string> {
    return await this.dateOfBirthInput.getAttribute('value');
  }

  async actualTeamSelectLastOption(): Promise<void> {
    await this.actualTeamSelect.all(by.tagName('option')).last().click();
  }

  async actualTeamSelectOption(option: string): Promise<void> {
    await this.actualTeamSelect.sendKeys(option);
  }

  getActualTeamSelect(): ElementFinder {
    return this.actualTeamSelect;
  }

  async getActualTeamSelectedOption(): Promise<string> {
    return await this.actualTeamSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class PlayerDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-player-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-player'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
