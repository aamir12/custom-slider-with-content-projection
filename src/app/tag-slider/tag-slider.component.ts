import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChildren,
  QueryList,
  HostListener,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tag-slider',
  templateUrl: './tag-slider.component.html',
  styleUrls: ['./tag-slider.component.css'],
})
export class TagSliderComponent
  implements AfterViewInit, OnChanges, OnInit, OnDestroy
{
  @ViewChild('tabsList') tabsList!: ElementRef;
  @ViewChildren('tagElement') tagElements!: QueryList<ElementRef>;

  showLeftArrow = false;
  showRightArrow = false;

  dragging = false;
  isDragging = false;
  activeTabIndex: number = 0;
  @Input('tags') tags: string[] = [];
  @Input('selectedTag') selectedTag: string = '';
  @Output('onSelect') onSelect = new EventEmitter<string>();

  destroyed$ = new Subject<boolean>();
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroyed$), debounceTime(200))
      .subscribe(() => {
        this.manageIcons();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.manageIcons();
      if (this.selectedTag) {
        this.selectTag(this.selectedTag);
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['tags']) {
      setTimeout(() => {
        this.manageIcons();
        this.selectTag(this.selectedTag);
      }, 0);
    }
  }

  selectTag(tag: string): void {
    if (this.tags.length === 0) {
      return;
    }
    const index = this.tags.findIndex((x) => x === tag);
    this.activeTabIndex = index;
    this.onSelect.emit(tag);
    const selectedTag = this.tagElements.filter((_, i) => i === index)[0]
      .nativeElement;

    if (this.tabsList && selectedTag) {
      const container = this.tabsList.nativeElement;

      const containerWidth = container.offsetWidth;
      const selectedTagWidth = selectedTag.offsetWidth;

      const selectedTagOffsetLeft = selectedTag.offsetLeft;
      const containerScrollLeft = container.scrollLeft;
      const centerOffset = (containerWidth - selectedTagWidth) / 2;

      if (selectedTagOffsetLeft - 50 < containerScrollLeft) {
        this.tabsList.nativeElement.scrollLeft =
          selectedTagOffsetLeft - centerOffset;
      } else if (
        selectedTagOffsetLeft + selectedTagWidth + 50 >
        containerScrollLeft + containerWidth
      ) {
        this.tabsList.nativeElement.scrollLeft =
          selectedTagOffsetLeft +
          selectedTagWidth -
          containerWidth +
          centerOffset;
      }
    }
  }

  scrollRight(): void {
    this.tabsList.nativeElement.scrollLeft += 200;
    this.manageIcons();
  }

  scrollLeft(): void {
    this.tabsList.nativeElement.scrollLeft -= 200;
    this.manageIcons();
  }

  manageIcons(): void {
    if (this.tags.length === 0) {
      return;
    }

    const scrollLeft = this.tabsList.nativeElement.scrollLeft;
    const maxScrollValue =
      this.tabsList.nativeElement.scrollWidth -
      this.tabsList.nativeElement.clientWidth -
      20;

    if (scrollLeft >= 20) {
      this.showLeftArrow = true;
    } else {
      this.showLeftArrow = false;
    }

    if (scrollLeft >= maxScrollValue) {
      this.showRightArrow = false;
    } else {
      this.showRightArrow = true;
    }

    this.cdr.detectChanges();
  }

  onMousemove(event: MouseEvent) {
    if (!this.dragging) return;
    this.isDragging = true;
    this.tabsList.nativeElement.scrollLeft -= event.movementX;
  }

  onMousedown(event: MouseEvent) {
    this.dragging = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.el.nativeElement.contains(event.target)) {
      this.dragging = false;
      this.isDragging = false;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
