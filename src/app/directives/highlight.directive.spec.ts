import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

@Component({ standalone: true, imports: [HighlightDirective], template: '<div appHighlight="lightblue" style="background-color: pink"></div>' })
class TestHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    element = fixture.debugElement.query(By.directive(HighlightDirective)).nativeElement;
  });

  it('applies the highlight color on mouseenter', () => {
    element.dispatchEvent(new Event('mouseenter'));
    expect(element.style.backgroundColor).toBe('lightblue');
  });

  it('restores the original background on mouseleave', () => {
    element.dispatchEvent(new Event('mouseenter'));
    element.dispatchEvent(new Event('mouseleave'));
    expect(element.style.backgroundColor).toBe('pink');
  });
});
